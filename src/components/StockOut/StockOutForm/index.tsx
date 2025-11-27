import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  BirdIcon,
  BoxIcon,
  CheckCircleIcon,
  Edit,
  HashIcon,
  HomeIcon,
  PlusIcon,
  Trash2,
  XCircleIcon,
  ScaleIcon,
  ListOrderedIcon,
  ChevronDown,
  CalendarDays,
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
import useCreateStockOut from "@/hooks/StockOut/useCreateStockOut";
import useCreateStockOutEntry from "@/hooks/StockOut/useCreateStockOutEntry";
import type {
  StockOutEntry,
  StockOutFormValues,
  StockOutMasterFormData,
  UpdatedBirdInventoryFormData,
} from "@/types/stockOut";
import useCreateFinalStockOut from "@/hooks/StockOut/useCreateFinalStockOut";
import { useParams } from "react-router-dom";
import useGetAllStockOutEntries from "@/hooks/StockOut/useGetAllStockOutEntries";
import useDeleteStockOutEntry from "@/hooks/StockOut/useDeleteStockOutEntry";

const validationSchema = Yup.object({
  batchNo: Yup.number()
    .typeError("Batch No must be a number")
    .required("Batch No is required"),
  birdsToAdd: Yup.number().typeError("Must be a number").min(0, "Cannot be negative"),
  weightToAdd: Yup.number()
    .typeError("Must be a number")
    .min(0.01, "Weight must be greater than zero")
    .required("Weight is required to add an entry."),
});

const StockOut = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [entries, setEntries] = useState<StockOutEntry[]>([]);

  const { mutate: createFinalStockOut, isPending: isSubmitting } =
    useCreateFinalStockOut();
  const { mutate: createStockOutEntry, isPending } = useCreateStockOutEntry();
  const { data: stockOutEntries, isPending: isFetching } = useGetAllStockOutEntries({
    masterId: id,
  });
  const { mutate: deleteStockOutEntry } = useDeleteStockOutEntry();

  console.log("stockOutEntries", stockOutEntries?.entries);
  useEffect(() => {
    if (Array.isArray(stockOutEntries?.entries)) {
      setEntries(stockOutEntries?.entries || []);
    }
  }, [stockOutEntries]);

  const totalEntries = entries.length;
  const totalBirds = entries.reduce((acc, entry) => acc + entry.birds, 0);
  const totalWeight = entries.reduce((acc, entry) => acc + entry.weight, 0);
  const averageWeight = totalBirds > 0 ? totalWeight / totalBirds : 0;

  const lastEntryBirdCount = entries.length > 0 ? entries[entries.length - 1].birds : 0;

  const formik = useFormik({
    initialValues: {
      date: dayjs(new Date()),
      batchNo: "",
      stockOutNo: "",
      birdsToAdd: "",
      weightToAdd: "",
      stockOutMasterId: id,
      // entries: [], // NEVER use async data here
    },

    validationSchema,
    onSubmit: (values) => {
      if (entries.length === 0) {
        toast.error("Please add at least one entry to the table.");
        return;
      }
      const payload = {
        date: dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss"),
        // batchNo: Number(values.batchNo),
        stockOutNo: Number(values.stockOutNo),
        masterId: id,
        // entries: entries,
        totalEntries: entries.length,
        totalBirds: totalBirds,
        totalWeight: totalWeight,
        avgWeight: averageWeight,
      };

      createFinalStockOut(
        { id: id, finalStockOut: payload },
        {
          onSuccess: (res: any) => {
            toast.success(res.message || "Stock Out Entry Added Successfully!");
            queryClient.invalidateQueries({ queryKey: ["get-all-birdInventories"] });
            formik.resetForm();
            setEntries([]);
          },
          onError: (error: Error) => {
            toast.error(error.message || "Error occcured.");
          },
        }
      );
    },
  });

  const addEntry = () => {
    let newBirdCount: number;

    if (formik.values.birdsToAdd === "") {
      if (entries.length === 0) {
        toast.error("Please enter the number of birds for the first entry.");
        return;
      }
      newBirdCount = lastEntryBirdCount;
    } else {
      formik.validateField("birdsToAdd");
      if (formik.errors.birdsToAdd) {
        toast.error(`Invalid Bird Count: ${formik.errors.birdsToAdd}`);
        return;
      }
      newBirdCount = Number(formik.values.birdsToAdd);
    }

    formik.validateField("weightToAdd");
    if (formik.errors.weightToAdd || Number(formik.values.weightToAdd) <= 0) {
      toast.error(
        formik.errors.weightToAdd ||
          "Weight (kg) is required and must be greater than zero."
      );
      return;
    }
    const newWeight = Number(formik.values.weightToAdd);

    if (newBirdCount <= 0) {
      toast.error("Bird count must be greater than zero.");
      return;
    }

    console.log("masterId", id);

    const newEntry = {
      srNo: entries.length + 1,
      stockOutMasterId: Number(id),
      birds: newBirdCount,
      weight: newWeight,
    };
    // setEntries((prev) => [...prev, newEntry]);

    createStockOutEntry(
      { stockOutEntry: newEntry },
      {
        onSuccess: (res: any) => {
          toast.success(res.message || "Stock Out Entry Added Successfully!");
          // formik.resetForm();
          setEntries((prev) => [...prev, res.entry]);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Error occcured.");
        },
      }
    );

    formik.setFieldValue("weightToAdd", "");
    formik.setFieldTouched("weightToAdd", false);

    if (formik.values.birdsToAdd !== "") {
      formik.setFieldValue("birdsToAdd", "");
      formik.setFieldTouched("birdsToAdd", false);
    }
  };

  const deleteEntry = (srNo: number) => {
    deleteStockOutEntry(
      { id: srNo },
      {
        onSuccess: (res: any) => {
          toast.success(res.message || "Stock Out Entry deleted Successfully!");
          queryClient.invalidateQueries({ queryKey: ["get-all-stock-out-entries"] });
          formik.resetForm();
          setEntries([]);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Error occcured.");
        },
      }
    );
    setEntries((prev) =>
      prev.filter((e) => e.srNo !== srNo).map((e, index) => ({ ...e, srNo: index + 1 }))
    );
  };

  const resetForm = () => {
    formik.resetForm();
    setEntries([]);
  };

  const isAddDisabled =
    isSubmitting ||
    !!formik.errors.weightToAdd ||
    !!formik.errors.birdsToAdd ||
    Number(formik.values.weightToAdd) <= 0 ||
    // Disable if no entries yet AND birdsToAdd is empty
    (entries.length === 0 && formik.values.birdsToAdd === "");

  return (
    <div className="p-2 bg-gray-50 min-h-screen font-sans mb-30">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-4 p-2 sm:p-2 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-2xl rounded-2xl border-t-8 border-emerald-500 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-emerald-800 text-center flex items-center justify-center gap-3 py-2">
          <BirdIcon className="w-10 h-10 text-emerald-600 animate-pulse" />
          Livestock Stock Out Entry
        </h2>

        <hr className="border-emerald-300" />

        {/* Batch Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-200 flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 border-b pb-2 border-emerald-100">
            <HashIcon className="w-6 h-6 text-emerald-600" /> General Information
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
            {/* Date picker */}
            <div className="flex flex-col gap-2 w-full">
              <Label
                htmlFor="date"
                className="font-medium text-gray-700 text-md flex items-center gap-2">
                <CalendarDays className="text-blue-500 w-5 h-5" />
                Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal text-md border-gray-300 bg-white hover:bg-gray-50 h-11">
                    {formik.values.date
                      ? dayjs(formik.values.date).format("DD/MMM/YYYY")
                      : "Select date"}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="p-0 w-[75vw] sm:w-72 bg-white rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    className="w-full"
                    selected={formik.values.date}
                    captionLayout="dropdown"
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
              value={formik.values.batchNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.batchNo && formik.errors.batchNo}
              icon={<HashIcon className="w-4 h-4 text-emerald-600" />}
            />

            <InputField
              label="Stock out Number"
              name="stockOutNo"
              type="number"
              value={formik.values.stockOutNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.stockOutNo && formik.errors.stockOutNo}
              icon={<HashIcon className="w-4 h-4 text-emerald-600" />}
            />
          </div>
        </div>

        {/* Bird Quantities for Table Entry */}
        <div className="bg-white p-4 px-2 rounded-xl shadow-lg border border-emerald-200 w-full">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 border-b pb-5 border-emerald-100">
            <ListOrderedIcon className="w-6 h-6 text-emerald-600" /> Add Entry Row
          </h3>

          <div className="flex gap-2 py-2 items-end">
            <InputField
              label="Sr No"
              name="srNo"
              type="number"
              value={entries.length + 1}
              // onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.weightToAdd && formik.errors.weightToAdd}
              // icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              placeholder="SrNo"
              className="!w-15"
            />

            <InputField
              label={`No. of Birds ${
                lastEntryBirdCount > 0 ? `(Default: ${lastEntryBirdCount})` : ""
              }`}
              name="birdsToAdd"
              type="number"
              value={formik.values.birdsToAdd}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.birdsToAdd && formik.errors.birdsToAdd}
              icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
              placeholder={
                lastEntryBirdCount > 0 ? lastEntryBirdCount.toString() : "Enter count"
              }
              className="flex-1"
            />

            {/* Weight(kg) */}
            <InputField
              label="Weight (kg) *"
              name="weightToAdd"
              type="number"
              value={formik.values.weightToAdd}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.weightToAdd && formik.errors.weightToAdd}
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              placeholder="weight"
              className="flex-1"
            />
          </div>
          <Button
            type="button"
            className="mt-3 bg-teal-600 rounded-full h-11 w-32 p-3 shadow-md hover:bg-teal-700 transition-colors disabled:bg-gray-400"
            onClick={addEntry}
            disabled={isAddDisabled}>
            <PlusIcon className="w-6" /> Add
          </Button>

          {/* Entries Table */}
          <div className="mt-6 overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-emerald-200 text-emerald-800 font-bold">
                  <th className="p-3 border-r border-b">Sr No</th>
                  <th className="p-3 border-r border-b">No. of Birds</th>
                  <th className="p-3 border-r border-b">Weight (kg)</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500 italic">
                      No entries added yet.
                    </td>
                  </tr>
                ) : (
                  entries.map((e, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 hover:bg-emerald-50">
                      <td className="border-r p-3">{e.srNo}</td>
                      <td className="border-r p-3 font-medium text-gray-800">
                        {e.birds}
                      </td>
                      <td className="border-r p-3 font-medium text-gray-800">
                        {e.weight.toFixed(2)}
                      </td>
                      <td className="p-3 flex gap-2 items-center">
                        <button
                          type="button"
                          title="Edit"
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          disabled>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => deleteEntry(e.srNo)}
                          className="text-red-500 hover:text-red-700 transition-colors">
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

        {/* Final Count (Calculated) */}
        <div className="bg-white p-6 px-2 rounded-xl shadow-lg border border-emerald-200 w-full">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 border-b pb-2 border-emerald-100">
            <HomeIcon className="w-6 h-6 text-emerald-600" /> Summary Totals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-4">
            <InputField
              label="Total Entries"
              name="totalEntries"
              type="number"
              value={totalEntries}
              readOnly
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              className="bg-emerald-50 font-bold p-2 rounded-lg"
            />
            {/* Total Birds */}
            <InputField
              label="Total Birds"
              name="totalBirds"
              type="number"
              value={totalBirds.toString()}
              readOnly
              icon={<BoxIcon className="w-4 h-4 text-emerald-600" />}
              className="bg-emerald-50 font-bold p-2 rounded-lg"
            />

            {/* Total Weight */}
            <InputField
              label="Total Weight(kg)"
              name="totalWeight"
              type="number"
              value={totalWeight.toFixed(2)}
              readOnly
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              className="bg-emerald-50 font-bold p-2 rounded-lg"
            />

            {/* Average Weight */}
            <InputField
              label="Average Weight (kg)"
              name="averageWeight"
              type="number"
              value={averageWeight.toFixed(3)}
              readOnly
              icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              className="bg-emerald-50 font-bold p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 my-2">
          <Button
            type="button"
            onClick={resetForm}
            className="w-auto px-6 h-11 bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold flex items-center gap-2 rounded-lg transition-all shadow-md">
            <XCircleIcon className="w-5 h-5" /> Reset Form
          </Button>

          <Button
            disabled={isSubmitting || entries.length === 0 || !formik.isValid}
            type="submit"
            className="w-auto px-6 h-11 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" /> Finalize Stock Out
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StockOut;
