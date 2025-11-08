import { useState, type ChangeEvent, type FormEvent } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import InputField from "@/components/Common/InputField";
import type { DailyRecordFormData } from "@/types";
import useCreateDailyRecord from "@/hooks/DailyRecord/useCreateDailyRecord";
import { useQueryClient } from "@tanstack/react-query";

const DashboardForm = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setdate] = useState<Date | undefined>(new Date());

  const [formData, setFormData] = useState<DailyRecordFormData>({
    birdAgeInDays: "",
    feedConsumedBags: "",
    mortalityCount: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      birdAgeInDays: "",
      feedConsumedBags: "",
      mortalityCount: "",
    });
  };

  const { mutate: createDailyRecord, isPending } = useCreateDailyRecord();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        birdAgeInDays: Number(formData.birdAgeInDays),
        feedConsumedBags: Number(formData.feedConsumedBags),
        mortalityCount: Number(formData.mortalityCount),
      };

      createDailyRecord(
        { dailyRecord: payload },
        {
          onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries({
              queryKey: ["get-all-dailyRecord", "get-dashboard"],
            });
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
      // const response = await axios.post(`${BASE_URL}/api/dailyrecord`, payload);
      // console.log(" Record submitted:", response.data);

      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setSubmitting(false), 1000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-white shadow-sm rounded-lg p-0  w-full max-w-5xl mx-auto">
      <h1 className="font-semibold text-2xl text-blue-600">Add Today's Record</h1>

      <div className="flex flex-wrap items-end gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="font-medium">
            Date
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-44 justify-between font-normal border-gray-300">
                {date ? dayjs(date).format("DD/MM/YYYY") : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setdate(d);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <InputField
          label="Bird Age (Days)"
          name="birdAgeInDays"
          type="number"
          value={formData.birdAgeInDays}
          onChange={handleInputChange}
          required
        />
        <InputField
          label="Feed Consumed (Bags)"
          name="feedConsumedBags"
          type="number"
          value={formData.feedConsumedBags}
          onChange={handleInputChange}
          required
        />
        <InputField
          label="Mortality Count"
          name="mortalityCount"
          type="number"
          value={formData.mortalityCount}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex flex-wrap gap-5 mt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-40 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        <Button
          type="button"
          onClick={resetForm}
          variant="secondary"
          className="w-40 h-10 bg-gray-400 hover:bg-gray-600 text-white font-semibold">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DashboardForm;
