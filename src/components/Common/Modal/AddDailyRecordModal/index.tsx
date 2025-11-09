import { useState, type ChangeEvent, type FormEvent } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, ChevronDown, Bird, Wheat, Skull, X } from "lucide-react";
import InputField from "@/components/Common/InputField";
import useCreateDailyRecord from "@/hooks/DailyRecord/useCreateDailyRecord";
import { useQueryClient } from "@tanstack/react-query";
import type { DailyRecordFormData } from "@/types";
import { Send, RotateCcw } from "lucide-react";

interface AddDailyRecordModalProps {
  open: boolean;
  onClose: () => void;
}

const AddDailyRecordModal = ({ open, onClose }: AddDailyRecordModalProps) => {
  const queryClient = useQueryClient();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [formData, setFormData] = useState<DailyRecordFormData>({
    date: new Date(),
    birdAgeInDays: "",
    feedConsumedBags: "",
    mortalityCount: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date(),
      birdAgeInDays: "",
      feedConsumedBags: "",
      mortalityCount: "",
    });
  };

  const { mutate: createDailyRecord, isPending: isSubmitting } = useCreateDailyRecord();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      date: dayjs(formData.date).format("YYYY-MM-DDTHH:mm:ss"),
      birdAgeInDays: Number(formData.birdAgeInDays),
      feedConsumedBags: Number(formData.feedConsumedBags),
      mortalityCount: Number(formData.mortalityCount),
    };

    createDailyRecord(
      { dailyRecord: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["get-all-dailyRecord"] });
          resetForm();
        },
      }
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      // Close modal when clicking outside of the form
      onClick={onClose}>
      {/* Form Container (Modal Content) */}
      <form
        onSubmit={handleSubmit}
        // Stop propagation to prevent closing when clicking inside the form
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-6 bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl transform transition-all duration-300 scale-100 ease-out border-t-4 border-blue-600">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-2 relative">
          <h1 className="font-extrabold text-2xl sm:text-3xl text-blue-700 flex items-center gap-3">
            <CalendarDays className="text-yellow-500 w-7 h-7" />
            Daily Farm Record
          </h1>

          {/* Close Button (Top Right) */}
          <Button
            onClick={onClose}
            className="p-2 h-auto w-auto bg-red-600 hover:bg-gray-200 text-white absolute top-0 right-0 rounded-full"
            variant="secondary">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Fields - Responsive Grid (2 columns on sm, 3 on md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="date"
              className="font-medium text-gray-700 text-md flex items-center gap-2">
              <CalendarDays className="text-blue-500 w-5 h-5" />
              Date
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal text-md border-gray-300 bg-white hover:bg-gray-50 h-11 text-gray-700 px-3 py-2 rounded-lg border">
                  {formData.date
                    ? dayjs(formData.date).format("DD/MMM/YYYY")
                    : "Select date"}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="p-2 w-full bg-white rounded-xl shadow-2xl z-50">
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

          {/* Bird Age (Days) */}
          <InputField
            label="Bird Age (Days)"
            name="birdAgeInDays"
            type="number"
            value={formData.birdAgeInDays}
            onChange={handleChange}
            required
            icon={<Bird className="text-blue-500 w-5 h-5" />}
          />

          {/* Feed Consumed (Bags) */}
          <InputField
            label="Feed Consumed (Bags)"
            name="feedConsumedBags"
            type="number"
            value={formData.feedConsumedBags}
            onChange={handleChange}
            required
            icon={<Wheat className="text-yellow-500 w-5 h-5" />}
          />

          {/* Mortality Count */}
          <InputField
            label="Mortality Count"
            name="mortalityCount"
            type="number"
            value={formData.mortalityCount}
            onChange={handleChange}
            required
            icon={<Skull className="text-red-500 w-5 h-5" />}
          />
        </div>

        {/* Action Buttons - Forced to One Row */}
        <div className="flex justify-center flex-row gap-4 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-36 h-11 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
            {isSubmitting ? (
              <>
                <span className="animate-spin">🌀</span> Submitting
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Submit
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={resetForm}
            variant="secondary"
            className="w-36 h-11 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
            <RotateCcw className="w-5 h-5" /> Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDailyRecordModal;
