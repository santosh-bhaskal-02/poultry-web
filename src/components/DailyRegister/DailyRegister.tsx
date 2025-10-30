import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";
import DialogBox from "../Common/DialogBox";
import DailyReport from "../Reports/DailyReport/DailyReport";
import dayjs from "dayjs";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DailyData {
  Age: string;
  DailyFeedConsume: string;
  DailyMortality: string;
}
const DailyRegister = () => {
  const BASE_URL = import.meta.env.VITE_API;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [data, setData] = useState<DailyData>({
    Age: "",
    DailyFeedConsume: "",
    DailyMortality: "",
  });

  const [isDisable, setDisable] = useState(false);
  useEffect(() => {
    setDate(new Date());
  }, []);

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setDisable(true);

      const payload = {
        Date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        Age: data.Age,
        DailyFeedConsume: data.DailyFeedConsume,
        DailyMortality: data.DailyMortality,
      };

      const response = await axios.post(`${BASE_URL}/api/dailyregister`, payload);

      console.log("Data submited successfully");

      setData({
        Age: "",
        DailyFeedConsume: "",
        DailyMortality: "",
      });
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

  function setFormData(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updateData = {
      ...data,
      [name]: value.toString(),
    };
    setData(updateData);
  }

  return (
    <>
      <div className="px-2 py-5">
        <form onSubmit={formSubmit}>
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date" className="px-1 font-semibold">
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

            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="age" className="font-semibold">
                Birds Age
              </Label>
              <input
                id="age"
                type="Number"
                className="border-gray-300 border-1 h-10 w-40 pl-3 rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500  focus:border-transparent"
                name="Age"
                value={data.Age}
                onChange={(e) => setFormData(e)}
              />
            </div>

            <div className="flex flex-row flex-wrap items-start gap-5">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="bags" className="font-semibold">
                  Today's Consumed Bags
                </Label>
                <input
                  id="bags"
                  type="Number"
                  className="border-gray-300 border-1 h-10 w-40 pl-3 rounded-md  focus:outline-none focus:ring-1  focus:ring-blue-500  focus:border-transparent"
                  name="DailyFeedConsume"
                  value={data.DailyFeedConsume}
                  onChange={(e) => setFormData(e)}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="mortalityCount" className="font-semibold">
                  Today's Mortality
                </Label>
                <input
                  id="mortalityCount"
                  type="Number"
                  className="border-gray-300 border-1 h-10 w-40 pl-3 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  name="DailyMortality"
                  value={data.DailyMortality}
                  onChange={(e) => setFormData(e)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isDisable}
              className="bg-blue-500 font-semibold text-white h-10 w-40 rounded-md hover:bg-blue-700 cursor-pointer">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4">
        <h1 className="text-blue-500 font-semibold px-2">Previous Records :</h1>
        <DailyReport data={data} />
      </div>
    </>
  );
};

export default DailyRegister;
