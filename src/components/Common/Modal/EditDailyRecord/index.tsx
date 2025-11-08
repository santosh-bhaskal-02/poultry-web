import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";

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

interface EditDailyRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: any;
}

const EditDailyRecordModal = ({
  editData,
  isOpen,
  onClose,
}: EditDailyRecordModalProps) => {
  console.log("editData", editData);

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
    setDate(editData.date);
    if (editData) {
      setData({
        Age: editData.age,
        DailyFeedConsume: editData.dailyFeedConsume,
        DailyMortality: editData.dailyMortality,
      });
    }
  }, [editData]);

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setDisable(true);

      const payload = {
        Id: editData.id,
        Date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        Age: data.Age,
        DailyFeedConsume: data.DailyFeedConsume,
        DailyMortality: data.DailyMortality,
      };

      const response = await axios.put(`${BASE_URL}/api/dailyregister/`, payload);

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
        onClose();
      }, 2000);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/dailyregister/soft-delete/${editData.id}`
      );

      console.log("response", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs"
        onClick={onClose}>
        <form onSubmit={formSubmit}>
          <div
            className="flex flex-col items-start bg-white p-4 gap-5"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex justify-between">
              <h1 className="font-semibold text-xl text-blue-600">Edit Record </h1>
              <button
                type="button"
                onClick={() => handleDelete(data.id)}
                className="bg-red-500 text-white w-20 h-auto px-2 rounded-md">
                Delete
              </button>
            </div>
            <div className="w-full flex flex-row flex-wrap justify-between gap-4">
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

            <div className="w-full flex flex-row justify-between gap-2">
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
            <div className="w-full flex flex-row justify-between gap-2">
              <button
                type="submit"
                disabled={isDisable}
                className="bg-black font-semibold text-white text-base h-10 w-40 rounded-md hover:bg-blue-700 cursor-pointer">
                {!isDisable ? "Submit" : "Editing..."}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-400 font-semibold text-white text-base h-10 w-40 rounded-md hover:bg-blue-700 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditDailyRecordModal;
