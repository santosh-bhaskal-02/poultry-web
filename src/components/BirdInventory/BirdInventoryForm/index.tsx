import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InputField from "@/components/Common/InputField";
import type { BirdInventoryFormData } from "@/types";

const BirdInventory = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<BirdInventoryFormData>({
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    const batchNo = Number(updated.batchNo);
    const boxCount = Number(updated.boxCount) || 0;
    const birdsPerBox = Number(updated.birdsPerBoxCount) || 0;
    const boxMortality = Number(updated.boxMortalityCount) || 0;
    const runs = Number(updated.disabledBirdCount) || 0;
    const weak = Number(updated.weakBirdCount) || 0;
    const excess = Number(updated.excessBirdCount) || 0;

    const totalBirds = boxCount * birdsPerBox;
    updated.totalBirdCount = totalBirds.toString();
    updated.birdsArrivedCount = totalBirds.toString();
    updated.housedBirdCount = (
      totalBirds -
      boxMortality -
      runs -
      weak +
      excess
    ).toString();

    setFormData(updated);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        Date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        BatchNo: Number(formData.batchNo),
        BoxCount: Number(formData.boxCount),
        BirdsPerBoxCount: Number(formData.birdsPerBoxCount),
        TotalBirdCount: Number(formData.totalBirdCount),
        BirdsArrivedCount: Number(formData.birdsArrivedCount),
        BoxMortalityCount: Number(formData.boxMortalityCount),
        disabledBirdCount: Number(formData.disabledBirdCount),
        WeakBirdCount: Number(formData.weakBirdCount),
        ExcessBirdCount: Number(formData.excessBirdCount),
        HousedBirdCount: Number(formData.housedBirdCount),
      };

      const res = await axios.post(`${BASE_URL}/api/birdsinventory`, payload);
      console.log("Inventory submitted:", res.data);

      setFormData({
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
    } catch (error) {
      console.error(" Error submitting inventory:", error);
    } finally {
      setTimeout(() => setSubmitting(false), 1500);
    }
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
                {date ? dayjs(date).format("DD/MM/YYYY") : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setDate(d);
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
          value={formData.BatchNo}
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

      <div className="flex justify-end mt-4">
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-40 h-10 bg-blue-600 text-white hover:bg-blue-700">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default BirdInventory;
