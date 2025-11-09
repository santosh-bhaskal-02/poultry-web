import { useState, type ChangeEvent, type FormEvent } from "react";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
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
    const excess = Number(updated.excessBirdCount) || 0;

    const totalBirds = boxCount * birdsPerBox;
    updated.totalBirdCount = totalBirds.toString();
    updated.birdsArrivedCount = totalBirds.toString();
    updated.housedBirdCount = (
      totalBirds -
      boxMortality -
      disabledBirdCount -
      weak +
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
      className="flex flex-col gap-6 p-6 bg-white shadow-sm rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-2">Bird Inventory Entry</h2>

      <div className="flex items-end gap-5 flex-wrap">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="font-semibold">
            Date
          </Label>
          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-44 h-10 justify-between font-normal border-gray-300">
                {formData.date
                  ? dayjs(formData.date).format("DD/MM/YYYY")
                  : "Select date"}
                <ChevronDownIcon />
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
          label="Batch No"
          name="batchNo"
          type="number"
          value={formData.batchNo}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <InputField
          label="No. of Boxes"
          name="boxCount"
          type="number"
          value={formData.boxCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Birds per Box"
          name="birdsPerBoxCount"
          type="number"
          value={formData.birdsPerBoxCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Total Birds"
          name="totalBirdCount"
          type="number"
          value={formData.totalBirdCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Birds Arrived"
          name="birdsArrivedCount"
          type="number"
          value={formData.birdsArrivedCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Box Mortality"
          name="boxMortalityCount"
          type="number"
          value={formData.boxMortalityCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Run Away"
          name="disabledBirdCount"
          type="number"
          value={formData.disabledBirdCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Weak Birds"
          name="weakBirdCount"
          type="number"
          value={formData.weakBirdCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Excess Birds"
          name="excessBirdCount"
          type="number"
          value={formData.excessBirdCount}
          onChange={handleInputChange}
        />
        <InputField
          label="Birds Housed"
          name="housedBirdCount"
          type="number"
          value={formData.housedBirdCount}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-wrap gap-5 mt-4">
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-40 h-10 bg-blue-600 text-white hover:bg-blue-700">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        <Button
          type="button"
          onClick={resetForm}
          variant="secondary"
          className="w-40 h-10 bg-gray-400 text-white hover:bg-gray-600 font-semibold">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BirdInventory;
