import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  BirdIcon,
  HashIcon,
  PlusIcon,
  Trash2,
  Edit,
  ScaleIcon,
  ListOrderedIcon,
  CalendarDays,
  ClipboardList,
  FileText,
  XCircle,
  BarChart3,
  CheckCircleIcon,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../Common/InputField";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "../../ui/label";
import useCreateStockOutEntry from "@/hooks/StockOut/useCreateStockOutEntry";
import useCreateFinalStockOut from "@/hooks/StockOut/useCreateFinalStockOut";
import { useParams } from "react-router-dom";
import useDeleteStockOutEntry from "@/hooks/StockOut/useDeleteStockOutEntry";
import type { StockOutEntry } from "@/types/stockOut";
import useGetStockOutById from "@/hooks/StockOut/useGetStockOutById";
import EditStockOutEntryModal from "@/components/Common/Modal/EditStockOutEntryModal";
import useUpdateStockOutEntry from "@/hooks/StockOut/useUpdateStockOutEntry";

// --- VALIDATION SCHEMA (Only for Master Fields now) ---
const masterValidationSchema = Yup.object({
  batchNo: Yup.number()
    .typeError("Batch No must be a number")
    .required("Batch No is required"),
  stockOutNo: Yup.number().typeError("Must be a number").optional(), // Made optional or required based on your need
});

const StockOut = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // --- STATE ---
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [entries, setEntries] = useState<StockOutEntry[]>([]);

  // SEPARATE STATE FOR ENTRY INPUTS (Decoupled from Formik)
  const [entryInputs, setEntryInputs] = useState({
    birds: "",
    weight: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{
    id: number;
    srNo: number;
    birds: number;
    weight: number;
  } | null>(null);

  // --- API HOOKS ---
  const { mutate: createStockOutEntry, isPending: isAddingEntry } =
    useCreateStockOutEntry();
  const { mutate: createFinalStockOut, isPending: isSubmitting } =
    useCreateFinalStockOut();
  const { data: stockOutData } = useGetStockOutById({ masterId: id });
  const { mutate: deleteStockOutEntry } = useDeleteStockOutEntry();
  const { mutate: updateStockOutEntry } = useUpdateStockOutEntry();

  // --- EFFECT: LOAD DATA ---
  useEffect(() => {
    if (Array.isArray(stockOutData?.data?.entries)) {
      setEntries(stockOutData?.data?.entries || []);
    }
  }, [stockOutData]);

  // --- CALCULATIONS ---
  const lastEntryBirdCount = entries.length ? entries[entries.length - 1].birds : 0;
  const totalEntries = entries.length;
  const totalBirds = entries.reduce((acc, e) => acc + e.birds, 0);
  const totalWeight = entries.reduce((acc, e) => acc + e.weight, 0);
  const avgWeight = totalBirds > 0 ? totalWeight / totalBirds : 0;

  // --- FORMIK (MASTER DATA ONLY) ---
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: stockOutData?.data?.date ?? dayjs(new Date()),
      batchNo: stockOutData?.data?.batchId ?? "",
      stockOutNo: stockOutData?.data?.stockOutNo ?? "",
      stockOutMasterId: id,
    },
    validationSchema: masterValidationSchema,
    onSubmit: (values) => {
      // Final Validation before submit
      if (entries.length === 0) {
        toast.error("Please add at least one entry to finalize.");
        return;
      }

      const payload = {
        date: dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss"),
        batchNo: Number(values.batchNo),
        stockOutNo: Number(values.stockOutNo),
        stockOutMasterId: Number(id),
        totalEntries,
        totalBirds,
        totalWeight,
        avgWeight,
      };

      createFinalStockOut(
        { id, finalStockOut: payload },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Stock Out Finalized Successfully!");
            queryClient.invalidateQueries({ queryKey: ["get-all-stock-out-entries"] });
            // formik.resetForm();
            // setEntries([]);
            setEntryInputs({ birds: "", weight: "" });
          },
          onError: (error) => {
            toast.error(error.message || "Error occurred.");
          },
        }
      );
    },
  });

  // --- HANDLERS FOR ENTRY ROW ---

  const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEntryInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (entry: StockOutEntry) => {
    setEditingEntry({
      id: entry.id,
      srNo: entry.srNo,
      birds: entry.birds,
      weight: entry.weight,
    });
    setIsEditOpen(true);
  };

  const handleAddEntry = () => {
    let birds: number;

    // 1. Determine Bird Count
    if (entryInputs.birds === "") {
      if (!entries.length) {
        toast.error("Enter bird count for first entry.");
        return;
      }
      birds = lastEntryBirdCount;
    } else {
      birds = Number(entryInputs.birds);
      if (birds <= 0) return toast.error("Birds must be > 0");
    }

    // 2. Validate Weight
    if (!entryInputs.weight || Number(entryInputs.weight) <= 0) {
      return toast.error("Enter valid weight");
    }

    // 3. Prepare Payload
    const newEntry = {
      // srNo: entries.length + 1,
      stockOutMasterId: Number(id),
      birds,
      weight: Number(entryInputs.weight),
    };

    // 4. API Call
    createStockOutEntry(
      { stockOutEntry: newEntry },
      {
        onSuccess: (res) => {
          toast.success("Entry Added!");
          setEntries((prev) => [...prev, res.entry]);
          setEntryInputs({ birds: "", weight: "" });
        },
      }
    );
  };

  const handleDeleteEntry = (id: number) => {
    deleteStockOutEntry(
      { id },
      {
        onSuccess: () => {
          toast.success("Entry Deleted!");
          queryClient.invalidateQueries({ queryKey: ["get-all-stock-out-entries"] });
          setEntries((prev) =>
            prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, srNo: i + 1 }))
          );
        },
      }
    );
  };

  const handleEditEntry = (entry) => {
    setIsEditOpen(false);
    updateStockOutEntry(
      { id: entry.id, stockOutEntry: entry },
      {
        onSuccess: () => {
          toast.success("Entry updated!");
          queryClient.invalidateQueries({ queryKey: ["get-all-stock-out-entries"] });
          setEntries((prev) =>
            prev.map((e) =>
              e.srNo === entry.srNo
                ? { ...e, birds: entry.birds, weight: entry.weight }
                : e
            )
          );
        },
      }
    );
  };

  return (
    <div className="p-2 bg-gray-50 mb-20 min-h-screen font-sans">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-4 p-2 sm:p-2 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-2xl rounded-2xl border-t-8 border-emerald-500 w-full max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-emerald-800 text-center flex items-center justify-center gap-3 py-2">
          <ClipboardList className="w-10 h-10 text-emerald-600" />
          Livestock Stock Out Entry
        </h2>

        <hr className="border-emerald-300" />

        {/* --- SECTION 1: MASTER INFO (Managed by Formik) --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-200 flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 border-b pb-2 border-emerald-100">
            <FileText className="w-6 h-6 text-emerald-600" /> General Information
          </h3>

          <div className="grid grid-cols-2 gap-5">
            {/* Date Picker */}
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-gray-700 text-md flex items-center gap-2">
                <CalendarDays className="text-blue-500 w-5 h-5" /> Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button" // Important: type="button" to prevent submit
                    className="w-full justify-between font-normal text-md border-gray-300 bg-white hover:bg-gray-50 h-11">
                    {dayjs(formik.values.date).format("DD/MMM/YYYY")}
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[75vw] sm:w-72 bg-white shadow-lg">
                  <Calendar
                    mode="single"
                    className="w-full"
                    selected={formik.values.date}
                    onSelect={(d: Date) => {
                      formik.setFieldValue("date", d);
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Batch No */}
            <InputField
              label="Batch Number"
              name="batchNo"
              type="number"
              icon={<HashIcon className="w-4 h-4 text-emerald-600" />}
              value={formik.values.batchNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.batchNo && formik.errors.batchNo}
            />

            {/* Stock Out No */}
            <InputField
              label="Stock Out Number"
              name="stockOutNo"
              type="number"
              icon={<ClipboardList className="w-4 h-4 text-emerald-600" />}
              value={formik.values.stockOutNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.stockOutNo && formik.errors.stockOutNo}
            />
          </div>
        </div>

        {/* --- SECTION 2: ADD ENTRY (Managed by Local State) --- */}
        <div className="bg-white p-4 px-2 rounded-xl shadow-lg border border-emerald-200">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 border-b pb-5 border-emerald-100">
            <ListOrderedIcon className="w-6 h-6 text-emerald-600" /> Add Entry Row
          </h3>

          <div className="flex gap-2 py-2 items-end">
            <InputField
              label="Sr No"
              type="number"
              name="srNo"
              className="!w-35"
              value={entries.length + 1}
              readOnly
            />

            <InputField
              label={`Birds ${lastEntryBirdCount ? `(Def: ${lastEntryBirdCount})` : ""}`}
              name="birds" // Matches key in entryInputs
              type="number"
              icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
              placeholder={lastEntryBirdCount ? `${lastEntryBirdCount}` : "Enter birds"}
              value={entryInputs.birds}
              onChange={handleEntryChange}
            />

            <InputField
              label="Weight (kg)"
              name="weight" // Matches key in entryInputs
              type="number"
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              placeholder="Enter weight"
              value={entryInputs.weight}
              onChange={handleEntryChange}
            />
          </div>

          {/* Add Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              className="bg-teal-600 rounded-full h-11 w-32 p-3 shadow-md hover:bg-teal-700 transition-colors disabled:bg-gray-400"
              disabled={isAddingEntry}
              onClick={handleAddEntry}>
              {isAddingEntry ? (
                "Adding..."
              ) : (
                <>
                  <PlusIcon className="w-5" /> Add
                </>
              )}
            </Button>
          </div>

          {/* Entries Table */}
          <div className="mt-6 overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-emerald-200 text-emerald-800 font-bold">
                  <th className="p-3 border-r">Sr No</th>
                  <th className="p-3 border-r">Birds</th>
                  <th className="p-3 border-r">Weight (kg)</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500 italic">
                      No entries yet.
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr
                      key={e.srNo}
                      className="odd:bg-white even:bg-gray-50 hover:bg-emerald-50">
                      <td className="border-r p-3">{e.srNo}</td>
                      <td className="border-r p-3">{e.birds}</td>
                      <td className="border-r p-3">{e.weight.toFixed(2)}</td>
                      <td className="p-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditClick(e)}
                          className="text-gray-400 cursor-not-allowed">
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(e.id)}
                          className="text-red-500 hover:text-red-700 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- SECTION 3: SUMMARY --- */}
        <div className="bg-white p-6 px-2 rounded-xl shadow-lg border border-emerald-200">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 border-b pb-2 border-emerald-100">
            <BarChart3 className="w-6 h-6 text-emerald-600" /> Summary Totals
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <InputField
              label="Total Entries"
              type="number"
              value={totalEntries}
              readOnly
              icon={<ListOrderedIcon className="w-4 h-4 text-emerald-600" />}
            />
            <InputField
              label="Total Birds"
              type="number"
              value={totalBirds}
              readOnly
              icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
            />
            <InputField
              label="Total Weight (kg)"
              type="number"
              value={totalWeight.toFixed(2)}
              readOnly
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
            />
            <InputField
              label="Avg Weight (kg)"
              type="number"
              value={avgWeight.toFixed(3)}
              readOnly
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => {
              formik.resetForm();
              setEntries([]);
              setEntryInputs({ birds: "", weight: "" });
            }}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold flex items-center gap-2 rounded-lg transition-all shadow-md">
            <XCircle className="w-5 h-5" /> Reset
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-auto px-6 h-11 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 rounded-lg disabled:opacity-50 cursor-pointer">
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" /> Finalize Stock Out
              </>
            )}
          </Button>
        </div>
        <EditStockOutEntryModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          entry={editingEntry}
          onSave={handleEditEntry}
        />
      </form>
    </div>
  );
};

export default StockOut;
