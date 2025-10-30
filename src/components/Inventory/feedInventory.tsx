import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FeedInventoryData {
  FeedName: string;
  NumberOfBagsArrived: string;
  DriverName: string;
  DriverPhoneNumber: string;
}
const FeedInventory = () => {
  const BASE_URL = import.meta.env.VITE_API;

  const [isDisable, setDisable] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // const obj = {
  //   Date: date,
  //   FeedName: "",
  //   NumberOfBagsArrived: "",
  //   DriverName: "",
  //   DriverPhoneNumber: "",
  // };

  useEffect(() => {
    setDate(new Date());
  }, []);

  const [data, setData] = useState<FeedInventoryData>({
    FeedName: "",
    NumberOfBagsArrived: "",
    DriverName: "",
    DriverPhoneNumber: "",
  });

  function setFormData(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updateData = {
      ...data,
      [name]: value.toString(),
    };
    setData(updateData);
  }

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setDisable(true);

      const payLoad = {
        Date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        FeedName: data.FeedName,
        NumberOfBagsArrived: data.NumberOfBagsArrived,
        DriverName: data.DriverName,
        DriverPhoneNumber: data.DriverPhoneNumber,
      };

      const response = await axios.post(`${BASE_URL}/api/feedinventory`, payLoad);

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
      <div className="flex flex-row flex-wrap items-start gap-5">
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="2" className="block text-base font-medium">
            Feed Name
          </label>
          <input
            id="2"
            type="text"
            className="border-gray-600 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="FeedName"
            value={data.FeedName}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="3" className="block text-base font-medium">
            No. Feed Bags Arrived
          </label>
          <input
            id="3"
            type="number"
            className="border-gray-600 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="NumberOfBagsArrived"
            value={data.NumberOfBagsArrived}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="4" className="font-medium">
            Driver Name
          </label>
          <input
            id="4"
            type="text"
            className="border-gray-600 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-3 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="DriverName"
            value={data.DriverName}
            onChange={(e) => setFormData(e)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="5" className="font-medium">
            Driver Phone Number
          </label>
          <input
            id="5"
            type="number"
            className="border-gray-600 text-base rounded-md border-1 bg-white/5 h-10 w-36 py-3 pr-2 pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent sm:text-sm/6"
            name="DriverPhoneNumber"
            value={data.DriverPhoneNumber}
            onChange={(e) => setFormData(e)}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isDisable}
        className="text-white text-base font-semibold bg-blue-500 p-1 h-10 w-36 rounded-xl">
        Submit
      </button>
    </form>
  );
};

export default FeedInventory;
