import { useState, type ChangeEvent, type FormEvent } from "react";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InputField from "@/components/Common/InputField";
import type { FeedInventoryFormData } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import useCreateFeedInventory from "@/hooks/FeedInventory/useCreateFeedInventory";

const FeedInventory = () => {
  const queryClient = useQueryClient();
  // const BASE_URL = import.meta.env.VITE_API_URL;
  const [isSubmitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  // const [date, setdate] = useState<Date | undefined>(new Date());

  const [formData, setFormData] = useState<FeedInventoryFormData>({
    date: new Date(),
    feedName: "",
    bagsArrivedCount: "",
    driverName: "",
    driverPhoneNumber: "",
  });

  const { mutate: createFeedInventory } = useCreateFeedInventory();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      date: dayjs(formData.date).format("YYYY-MM-DDTHH:mm:ss"),
      feedName: "",
      bagsArrivedCount: "",
      driverName: "",
      driverPhoneNumber: "",
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        date: dayjs(formData.date).format("YYYY-MM-DDTHH:mm:ss"),
        feedName: formData.feedName,
        bagsArrivedCount: formData.bagsArrivedCount,
        driverName: formData.driverName,
        driverPhoneNumber: formData.driverPhoneNumber,
      };
      createFeedInventory(
        { feedInventory: payload },
        {
          onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries({
              queryKey: ["get-all-feedInventories"],
            });
            queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
      // const response = await axios.post(`${BASE_URL}/api/feedinventory`, payload);
      // console.log("Feed Inventory submitted:", response.data);
      resetForm();
    } catch (error) {
      console.error("Error submitting feed inventory:", error);
    } finally {
      setTimeout(() => setSubmitting(false), 1000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-white shadow-sm rounded-lg p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600">Feed Inventory Entry</h2>

      <div className="flex flex-col gap-2 w-fit">
        <Label htmlFor="date" className="font-medium">
          Date
        </Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-44 h-10 justify-between font-normal border-gray-300">
              {formData.date ? dayjs(formData.date).format("DD/MM/YYYY") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
        <InputField
          label="Feed Name"
          name="feedName"
          type="text"
          value={formData.feedName}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Bags Arrived"
          name="bagsArrivedCount"
          type="number"
          value={formData.bagsArrivedCount}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Driver Name"
          name="driverName"
          type="text"
          value={formData.driverName}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Driver Phone Number"
          name="driverPhoneNumber"
          type="number"
          value={formData.driverPhoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex flex-wrap gap-5 mt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-40 h-10 bg-blue-600 text-white hover:bg-blue-700 font-semibold">
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

export default FeedInventory;
