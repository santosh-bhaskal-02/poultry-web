import { useState, type ChangeEvent, type FormEvent } from "react";
import dayjs from "dayjs";
import {
  BanIcon,
  BirdIcon,
  BoxIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  HashIcon,
  HeartCrackIcon,
  HomeIcon,
  PlusCircleIcon,
  SkullIcon,
  XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InputField from "@/components/Common/InputField";
import type { BirdInventoryFormData } from "@/types";
import useCreateBirdInventory from "@/hooks/BirdInventory/useCreateBirdInventory";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BirdInventory = () => {
  const queryClient = useQueryClient();
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const { mutate: createBirdInventory, isPending: isSubmitting } =
    useCreateBirdInventory();

  const [formData, setFormData] = useState<BirdInventoryFormData>({
    date: new Date(),
    batchNo: "",
    boxCount: "",
    birdsPerBoxCount: "",
    totalBirdCount: "",
    birdsArrivedCount: "",
    boxMortalityCount: "",
    disabledBirdCount: "",
    weakBirdCount: "",
    excessBirdCount: "",
    shortBirdCount: "",
    housedBirdCount: "",
  });

  const resetForm = () => {
    setFormData({
      date: new Date(),
      batchNo: "",
      boxCount: "",
      birdsPerBoxCount: "",
      totalBirdCount: "",
      birdsArrivedCount: "",
      boxMortalityCount: "",
      disabledBirdCount: "",
      weakBirdCount: "",
      excessBirdCount: "",
      shortBirdCount: "",
      housedBirdCount: "",
    });
  };

  const [isHousedOverridden, setIsHousedOverridden] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let updated = { ...formData, [name]: value };

    // When user edits Birds Housed → Enable override
    if (name === "housedBirdCount") {
      setIsHousedOverridden(true);

      // If user clears the field → remove override & auto-calc will resume
      if (value === "") {
        setIsHousedOverridden(false);
      }

      setFormData(updated);
      return;
    }

    // Auto-calc for all other fields
    const boxCount = Number(updated.boxCount) || 0;
    const birdsPerBox = Number(updated.birdsPerBoxCount) || 0;
    const boxMortality = Number(updated.boxMortalityCount) || 0;
    const disabledBirdCount = Number(updated.disabledBirdCount) || 0;
    const weak = Number(updated.weakBirdCount) || 0;
    const short = Number(updated.shortBirdCount) || 0;
    const excess = Number(updated.excessBirdCount) || 0;

    const totalBirds = boxCount * birdsPerBox;

    updated.totalBirdCount = totalBirds.toString();
    updated.birdsArrivedCount = totalBirds.toString();

    // Only auto-update Birds Housed if NOT overridden manually
    if (!isHousedOverridden) {
      updated.housedBirdCount = (
        totalBirds -
        boxMortality -
        disabledBirdCount -
        weak -
        short +
        excess
      ).toString();
    }

    setFormData(updated);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: BirdInventoryFormData = {
      date: dayjs(formData.date).format("YYYY-MM-DDTHH:mm:ss"),
      batchNo: Number(formData.batchNo),
      boxCount: Number(formData.boxCount),
      birdsPerBoxCount: Number(formData.birdsPerBoxCount),
      totalBirdCount: Number(formData.totalBirdCount),
      birdsArrivedCount: Number(formData.birdsArrivedCount),
      boxMortalityCount: Number(formData.boxMortalityCount),
      disabledBirdCount: Number(formData.disabledBirdCount),
      weakBirdCount: Number(formData.weakBirdCount),
      excessBirdCount: Number(formData.excessBirdCount),
      shortBirdCount: Number(formData.shortBirdCount),
      housedBirdCount: Number(formData.housedBirdCount),
    };

    createBirdInventory(
      { birdInventory: payload },
      {
        onSuccess: (res) => {
          console.log("success");
          toast.success(res?.message || "Bird inventory added successfully");
          queryClient.invalidateQueries({
            queryKey: ["get-all-birdInventories"],
          });
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          resetForm();
        },
        onError: (error) => {
          toast.success(error.message || "Failed to add Bird inventory");
          console.log(error);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mb-20 gap-6 p-5 sm:p-7 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-xl rounded-2xl border-t-4 border-emerald-500 w-full">
      <h2 className="text-3xl font-extrabold text-emerald-700 text-center flex items-center justify-center gap-3">
        <BirdIcon className="w-9 h-9 text-emerald-600" />
        Bird Inventory Entry
      </h2>

      <hr className="border-emerald-200" />

      {/* Batch Info */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 flex flex-col gap-4 w-full">
        <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
          <HashIcon className="w-5 h-5 text-emerald-600" /> Batch Information
        </h3>

        {/* Date picker */}
        <div className="flex flex-col gap-2 w-full">
          <Label className="font-medium text-emerald-600 flex items-center gap-1">
            <CalendarIcon className="w-4 h-4 text-emerald-600" /> Entry Date
          </Label>

          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full h-11 justify-between font-medium border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                {dayjs(formData.date).format("DD/MM/YYYY")}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Calendar
                mode="single"
                className="w-72"
                selected={formData.date}
                onSelect={(d) => {
                  setFormData({ ...formData, date: d });
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
          value={formData.batchNo}
          onChange={handleInputChange}
          icon={<HashIcon className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Bird Quantities */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <BoxIcon className="w-5 h-5 text-emerald-600" /> Bird Quantities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Box Count"
            name="boxCount"
            type="number"
            value={formData.boxCount}
            onChange={handleInputChange}
            icon={<BoxIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Birds Per Box"
            name="birdsPerBoxCount"
            type="number"
            value={formData.birdsPerBoxCount}
            onChange={handleInputChange}
            icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Total Birds"
            name="totalBirdCount"
            type="number"
            value={formData.totalBirdCount}
            onChange={handleInputChange}
            icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Birds Arrived"
            name="birdsArrivedCount"
            type="number"
            value={formData.birdsArrivedCount}
            onChange={handleInputChange}
            icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Discrepancies */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <SkullIcon className="w-5 h-5 text-emerald-600" /> Discrepancies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Box Mortality"
            name="boxMortalityCount"
            type="number"
            value={formData.boxMortalityCount}
            onChange={handleInputChange}
            icon={<SkullIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Runs Birds"
            name="disabledBirdCount"
            type="number"
            value={formData.disabledBirdCount}
            onChange={handleInputChange}
            icon={<BanIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Weak Birds"
            name="weakBirdCount"
            type="number"
            value={formData.weakBirdCount}
            onChange={handleInputChange}
            icon={<HeartCrackIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Short Birds"
            name="shortBirdCount"
            type="number"
            value={formData.shortBirdCount}
            onChange={handleInputChange}
            icon={<HeartCrackIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Excess Birds"
            name="excessBirdCount"
            type="number"
            value={formData.excessBirdCount}
            onChange={handleInputChange}
            icon={<PlusCircleIcon className="w-4 h-4 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Final Count */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <HomeIcon className="w-5 h-5 text-emerald-600" /> Final Count
        </h3>

        <InputField
          label="Birds Housed"
          name="housedBirdCount"
          type="number"
          value={formData.housedBirdCount}
          onChange={handleInputChange}
          icon={<HomeIcon className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <Button
          type="button"
          onClick={resetForm}
          className="w-auto px-4 h-11 bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold flex items-center gap-2 rounded-lg">
          <XCircleIcon className="w-5 h-5" /> Cancel
        </Button>

        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-auto px-4 h-11 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg flex items-center gap-2 rounded-lg">
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5" /> Submit Entry
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BirdInventory;
