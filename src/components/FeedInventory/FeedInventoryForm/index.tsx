import { useState, type ChangeEvent, type FormEvent } from "react";
import dayjs from "dayjs";
import {
  CalendarIcon,
  PackageIcon,
  TruckIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  LeafIcon,
  SaladIcon,
  ChevronDownIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import InputField from "@/components/Common/InputField";

import type { FeedInventoryFormData } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import useCreateFeedInventory from "@/hooks/FeedInventory/useCreateFeedInventory";
import { toast } from "sonner";

const FeedInventory = () => {
  const queryClient = useQueryClient();

  const [isSubmitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

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

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date(),
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
            toast.success("Feed inventory added successfully");
            queryClient.invalidateQueries({ queryKey: ["get-all-feedInventories"] });
            queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
            resetForm();
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to add feed inventory");
          },
        }
      );
    } finally {
      setTimeout(() => setSubmitting(false), 800);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 mb-20 p-5 sm:p-7 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-xl rounded-2xl border-t-4 border-emerald-500 w-full">
      <h2 className="text-3xl font-extrabold text-emerald-700 text-center flex items-center justify-center gap-3">
        <LeafIcon className="w-9 h-9 text-emerald-600" />
        Feed Inventory Entry
      </h2>

      <hr className="border-emerald-200" />

      {/* Date Section */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          Entry Date
        </h3>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full sm:w-60 h-11 justify-between font-medium border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
              {dayjs(formData.date).format("DD/MM/YYYY")}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(d) => {
                setFormData({ ...formData, date: d || new Date() });
                setCalendarOpen(false);
              }}
              className="w-72"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Feed Details */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <SaladIcon className="w-5 h-5 text-emerald-600" /> Feed Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Feed Name"
            name="feedName"
            value={formData.feedName}
            type="text"
            onChange={handleInputChange}
            icon={<PackageIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Bags Arrived"
            name="bagsArrivedCount"
            value={formData.bagsArrivedCount}
            type="number"
            onChange={handleInputChange}
            icon={<PackageIcon className="w-4 h-4 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Driver Information */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <TruckIcon className="w-5 h-5 text-emerald-600" /> Driver Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Driver Name"
            name="driverName"
            value={formData.driverName}
            type="text"
            onChange={handleInputChange}
            icon={<UserIcon className="w-4 h-4 text-emerald-600" />}
          />

          <InputField
            label="Driver Phone Number"
            name="driverPhoneNumber"
            value={formData.driverPhoneNumber}
            type="number"
            onChange={handleInputChange}
            icon={<PhoneIcon className="w-4 h-4 text-emerald-600" />}
          />
        </div>
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

export default FeedInventory;
