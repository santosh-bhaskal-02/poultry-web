import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";
import DailyReport from "../Reports/DailyReport";
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

interface DashBoard {
  totalMortality: number;
  totalAliveBirds: number;
  totalFeedConsume: number;
  totalFeedBags: number;
  totalFeedBagsAvailable: number;
}

const DailyRegister = () => {
  const BASE_URL = import.meta.env.VITE_API;
  const [open, setOpen] = useState(false);
  const [dashBoard, setDashBoard] = useState<DashBoard>({
    totalMortality: 0,
    totalAliveBirds: 0,
    totalFeedConsume: 0,
    totalFeedBags: 0,
    totalFeedBagsAvailable: 0,
  });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [data, setData] = useState<DailyData>({
    Age: "",
    DailyFeedConsume: "",
    DailyMortality: "",
  });

  const [isDisable, setDisable] = useState(false);

  const fetchDashBoardData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard`);

      setDashBoard(response.data.data);
      console.log("dashboard", response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDate(new Date());

    fetchDashBoardData();
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

  const handleCancel = () => {
    setData({
      Age: "",
      DailyFeedConsume: "",
      DailyMortality: "",
    });
  };
  return (
    <>
      <div className="flex flex-col gap-10 px-2 py-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-500 text-white font-semibold rounded-xl p-3">
            <h1 className="text-lg">Mortality Count</h1>
            <h1 className="text-2xl"> {dashBoard?.totalMortality}</h1>
          </div>
          <div className="bg-green-500 flex flex-col justify-between  text-white font-semibold rounded-xl p-3">
            <h1 className="text-lg">Alive Count</h1>
            <h1 className="text-2xl"> {dashBoard?.totalAliveBirds}</h1>
          </div>
          <div className="bg-orange-400 text-white font-semibold rounded-xl p-3">
            <h1 className="text-lg">Feed(Bags) Consumption</h1>
            <h1 className="text-2xl"> {dashBoard?.totalFeedConsume}</h1>
          </div>

          <div className="bg-blue-500 text-white font-semibold rounded-xl p-3">
            <h1 className="text-lg">Feed(Bags) Available</h1>
            <h1 className="text-2xl"> {dashBoard?.totalFeedBagsAvailable}</h1>
          </div>
        </div>

        <form onSubmit={formSubmit}>
          <div className="flex flex-col items-start gap-5">
            <div>
              <h1 className="font-semibold text-xl text-blue-600">Add Today's Record </h1>
            </div>
            <div className="flex flex-row flex-wrap items-start gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="px-1 text-base font-semibold">
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-40 h-10 justify-between font-normal text-base border-gray-300 border-1 rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500  focus:border-transparent">
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
                <Label htmlFor="age" className="font-semibold text-base">
                  Birds Age
                </Label>
                <input
                  id="age"
                  type="Number"
                  className="border-gray-300 border h-10 w-40 pl-3 rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500  focus:border-transparent"
                  name="Age"
                  value={data.Age}
                  onChange={(e) => setFormData(e)}
                />
              </div>
            </div>

            <div className="flex flex-row flex-wrap items-start gap-5">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="bags" className="w-40 h-auto font-semibold text-base">
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
                <Label
                  htmlFor="mortalityCount"
                  className="w-40 h-12 font-semibold text-base">
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
            <div className="flex flex-row flex-wrap items-start gap-5">
              <button
                type="submit"
                disabled={isDisable}
                className="bg-black font-semibold text-white text-base h-10 w-40 rounded-md hover:bg-blue-700 cursor-pointer">
                {!isDisable ? "Submit" : "Submitting..."}
              </button>
              <button
                type="button"
                onClick={() => handleCancel()}
                className="bg-gray-400 font-semibold text-white text-base h-10 w-40 rounded-md hover:bg-gray-600 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-2">
          <h1 className="text-blue-500 font-semibold text-base">Previous Records :</h1>
          <DailyReport />
        </div>
      </div>
    </>
  );
};

export default DailyRegister;
