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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

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
    updated.housedBirdCount = (
      totalBirds -
      boxMortality -
      disabledBirdCount -
      weak -
      short +
      excess
    ).toString();

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
        onSuccess: () => {
          console.log("success");
          queryClient.invalidateQueries({
            queryKey: ["get-all-birdInventories"],
          });
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          resetForm();
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mb-10 gap-5 p-4 sm:p-6 bg-gray-50 shadow-2xl rounded-xl border-t-4 w-full">
      <h2 className="text-2xl font-extrabold text-blue-800 text-center flex items-center justify-center gap-2">
        <BirdIcon className="w-8 h-8 text-blue-600" />
        Bird Inventory Entry
      </h2>

      <hr className="border-blue-100" />

      {/* Batch Info */}
      <div className="bg-white p-4 rounded-lg shadow-inner flex flex-col gap-4 w-full">
        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
          <HashIcon className="w-5 h-5 text-gray-500" /> Batch Information
        </h3>

        <div className="flex flex-col gap-2 w-full">
          <Label
            htmlFor="date"
            className="font-semibold text-gray-700 flex items-center gap-1">
            <CalendarIcon className="w-4 h-4 text-gray-500" /> Entry Date
          </Label>

          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full h-11 justify-between font-medium border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100">
                {formData.date
                  ? dayjs(formData.date).format("DD/MM/YYYY")
                  : "Select date"}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Calendar
                mode="single"
                className="w-72"
                selected={formData.date}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setFormData({ ...formData, date: d });
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <InputField
          icon={
            <span className="flex items-center gap-1">
              <HashIcon className="w-4 h-4 text-gray-500" /> Batch No
            </span>
          }
          name="batchNo"
          type="number"
          value={formData.batchNo}
          onChange={handleInputChange}
        />
      </div>

      {/* Bird Quantities */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <BoxIcon className="w-5 h-5 text-gray-500" /> Bird Quantities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full">
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <BoxIcon className="w-4 h-4 text-gray-500" /> Boxes
              </span>
            }
            name="boxCount"
            type="number"
            value={formData.boxCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <BirdIcon className="w-4 h-4 text-gray-500" /> Birds/Box
              </span>
            }
            name="birdsPerBoxCount"
            type="number"
            value={formData.birdsPerBoxCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <BirdIcon className="w-4 h-4 text-gray-500" /> Total Birds
              </span>
            }
            name="totalBirdCount"
            type="number"
            value={formData.totalBirdCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <BirdIcon className="w-4 h-4 text-gray-500" /> Arrived
              </span>
            }
            name="birdsArrivedCount"
            type="number"
            value={formData.birdsArrivedCount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Discrepancies */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <SkullIcon className="w-5 h-5 text-gray-500" /> Discrepancies
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full">
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <SkullIcon className="w-4 h-4 text-gray-500" /> Box Mortality
              </span>
            }
            name="boxMortalityCount"
            type="number"
            value={formData.boxMortalityCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <BanIcon className="w-4 h-4 text-gray-500" /> Runs Birds
              </span>
            }
            name="disabledBirdCount"
            type="number"
            value={formData.disabledBirdCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <HeartCrackIcon className="w-4 h-4 text-gray-500" /> Weak Birds
              </span>
            }
            name="weakBirdCount"
            type="number"
            value={formData.weakBirdCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <HeartCrackIcon className="w-4 h-4 text-gray-500" /> Short Birds
              </span>
            }
            name="shortBirdCount"
            type="number"
            value={formData.shortBirdCount}
            onChange={handleInputChange}
          />
          <InputField
            icon={
              <span className="flex items-center gap-1">
                <PlusCircleIcon className="w-4 h-4 text-gray-500" /> Excess Birds
              </span>
            }
            name="excessBirdCount"
            type="number"
            value={formData.excessBirdCount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Final Count */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <HomeIcon className="w-5 h-5 text-gray-500" /> Final Count
        </h3>
        <InputField
          icon={
            <span className="flex items-center gap-1">
              <HomeIcon className="w-4 h-4 text-gray-500" /> Birds Housed
            </span>
          }
          name="housedBirdCount"
          type="number"
          value={formData.housedBirdCount}
          onChange={handleInputChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-row sm:flex-row justify-end gap-2 mt-2 mb-10 w-full">
        <Button
          type="button"
          onClick={resetForm}
          variant="secondary"
          className="w-auto h-11 bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold transition-colors flex items-center justify-center gap-2">
          <XCircleIcon className="w-5 h-5" /> Cancel
        </Button>

        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-auto h-11 bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
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
