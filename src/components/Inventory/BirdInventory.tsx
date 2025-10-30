import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BirdInventoryData {
  NumberOfBox: string;
  NumberOfBirds: string;
  Total: string;
  NumberOfBirdsArrived: string;
  NumberOfBoxMortality: string;
  NumberOfRuns: string;
  NumberOfWeaks: string;
  NumberOfExcess: string;
  NumberOfBirdsHoused: string;
}

const BirdInventory = () => {
  const BASE_URL = import.meta.env.VITE_API;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const [data, setData] = useState<BirdInventoryData>({
    NumberOfBox: "",
    NumberOfBirds: "",
    Total: "",
    NumberOfBirdsArrived: "",
    NumberOfBoxMortality: "",
    NumberOfRuns: "",
    NumberOfWeaks: "",
    NumberOfExcess: "",
    NumberOfBirdsHoused: "",
  });

  const [isDisable, setDisable] = useState(false);

  function setFormData(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    const updateData = {
      ...data,
      [name]: value,
    };

    const NumberOfBox = Number(updateData.NumberOfBox) || 0;
    const NumberOfBirds = Number(updateData.NumberOfBirds) || 0;

    const totalStock = NumberOfBox * NumberOfBirds;

    updateData.Total = totalStock.toString();
    updateData.NumberOfBirdsArrived = totalStock.toString();
    updateData.NumberOfBirdsHoused = (
      totalStock -
      Number(updateData.NumberOfBoxMortality) -
      Number(updateData.NumberOfRuns) -
      Number(updateData.NumberOfWeaks) +
      Number(updateData.NumberOfExcess)
    ).toString();

    setData(updateData);
  }

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setDisable(true);

      const payload = {
        Date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        NumberOfBox: Number(data.NumberOfBox),
        NumberOfBirds: Number(data.NumberOfBirds),
        Total: Number(data.Total),
        NumberOfBirdsArrived: Number(data.NumberOfBirdsArrived),
        NumberOfBoxMortality: Number(data.NumberOfBoxMortality),
        NumberOfWeaks: Number(data.NumberOfWeaks),
        NumberOfExcess: Number(data.NumberOfExcess),
        NumberOfBirdsHoused: Number(data.NumberOfBirdsHoused),
      };
      const response = await axios.post(`${BASE_URL}/api/birdsinventory`, payload);

      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setDisable(false);
        console.log("Delayed for 1 second.");
      }, 2000);
    }
  };

  return (
    <form onSubmit={formSubmit} className="flex flex-col items-start gap-5 m-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="date" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-40 h-10 justify-between font-normal border-gray-300 border-1 rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500  focus:border-transparent">
              {date ? dayjs(date).format("DD/MM/YYYY") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 overflow-hidden p-0" align="start">
            <Calendar
              className="w-full"
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-row justify-center gap-2">
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="1" className="block text-base w-20 text-black font-semibold">
            No. of Boxes
          </label>
          <input
            id="1"
            type="number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5 h-10 w-21 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfBox"
            value={data.NumberOfBox}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="2" className="block text-base w-20 text-black font-medium">
            No. Birds Per Box
          </label>
          <input
            id="2"
            type="number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5 h-10 w-21 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfBirds"
            value={data.NumberOfBirds}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="3" className="block text-base h-12 text-black font-medium">
            Total
          </label>
          <input
            id="3"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5 h-10 w-30 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="Total"
            value={data.Total}
            onChange={(e) => setFormData(e)}
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-start gap-5">
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="4" className="block text-base text-black font-medium">
            No. Birds Arrived
          </label>
          <input
            id="4"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfBirdsArrived"
            value={data.NumberOfBirdsArrived}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="5" className="font-medium">
            Box Mortality
          </label>
          <input
            id="5"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfBoxMortality"
            value={data.NumberOfBoxMortality}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="6" className="font-medium">
            Runs
          </label>
          <input
            id="6"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfRuns"
            value={data.NumberOfRuns}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="7" className="font-medium">
            Weak
          </label>
          <input
            id="7"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5  h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfWeaks"
            value={data.NumberOfWeaks}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="8" className="font-medium">
            Execess
          </label>
          <input
            id="8"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5  h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfExcess"
            value={data.NumberOfExcess}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="9" className="font-medium">
            Total Birds Housed
          </label>
          <input
            id="9"
            type="Number"
            className="appearance-none border-gray-300 text-base rounded-md border-1 bg-white/5  h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfBirdsHoused"
            value={data.NumberOfBirdsHoused}
            onChange={(e) => setFormData(e)}
          />
        </div>
      </div>
      <button
        disabled={isDisable}
        type="submit"
        className="text-white text-base font-medium bg-blue-500 p-1 h-10 w-36 rounded-xl">
        Submit
      </button>
    </form>
  );
};

export default BirdInventory;
