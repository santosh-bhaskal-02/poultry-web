import { useEffect, useState, type ChangeEvent } from "react";
import dayjs from "dayjs";
import * as React from "react";
import {
  CalendarDays,
  Activity,
  Package,
  AlertTriangle,
  ChevronDownIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useUpdateDailyRecord from "@/hooks/DailyRecord/useUpdateDailyRecord";
import useDeleteDailyRecord from "@/hooks/DailyRecord/useDeleteDailyRecord";
import { useQueryClient } from "@tanstack/react-query";
import type { DailyRecordFormData } from "@/types";
import DeleteAlertDialog from "../../DeleteAlertDialog";
import Spinner from "../../Spinner";
import { toast } from "sonner";
import InputField from "../../InputField";

interface EditDailyRecordModalProps {
  editData: DailyRecordFormData;
  isOpen: boolean;
  onClose: () => void;
}

const EditDailyRecordModal = ({
  editData,
  isOpen,
  onClose,
}: EditDailyRecordModalProps) => {
  const [openCalendar, setCalendarOpen] = useState(false);

  const [data, setData] = useState<DailyRecordFormData>({
    date: new Date(),
    birdAgeInDays: "",
    feedConsumedBags: "",
    mortalityCount: "",
  });

  const queryClient = useQueryClient();
  const { mutate: updateDailyRecord, isPending: isEditing } = useUpdateDailyRecord();
  const { mutate: deleteRecord, isPending: isDeleting } = useDeleteDailyRecord(
    editData.id
  );

  useEffect(() => {
    if (editData) {
      setData({
        date: editData.date,
        birdAgeInDays: editData.birdAgeInDays,
        feedConsumedBags: editData.feedConsumedBags,
        mortalityCount: editData.mortalityCount,
      });
    }
  }, [editData]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updateData = {
      ...data,
      [name]: value,
    };
    setData(updateData);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: editData.id,
      date: dayjs(editData.date).format("YYYY-MM-DDTHH:mm:ss"),
      birdAgeInDays: data.birdAgeInDays,
      feedConsumedBags: data.feedConsumedBags,
      mortalityCount: data.mortalityCount,
    };

    updateDailyRecord(
      { id: editData.id, dailyRecord: payload },
      {
        onSuccess: () => {
          toast.success("Daily record updated successfully");

          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["get-all-dailyRecord"] });

          console.log("Data submited successfully");
          onClose();
        },

        onError: (error) => {
          console.log(error);
          toast.error(error?.message || "Failed to update record");
        },
      }
    );
  };

  const handleDelete = async (id: number) => {
    deleteRecord(
      { id },
      {
        onSuccess: () => {
          console.log("Data deleted successfully");
          toast.success("Daily record deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["get-all-dailyRecord"],
          });
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          onClose();
        },

        onError: (error) => {
          console.log(error);
          toast.error(error?.message || "Failed to delete record");
        },
      }
    );
  };

  const [isDeleteDialogOen, setIsDeleteDialogOpen] = useState(false);

  const handleConfirm = () => {
    handleDelete(editData.id);
    setIsDeleteDialogOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-0"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100 transition-all">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl shadow-sm">
          <h1 className="font-semibold text-lg sm:text-xl flex items-center gap-2">
            <Package className="w-5 h-5" />
            Edit Daily Record
          </h1>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm sm:text-base transition-all flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date and Bird Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="date"
                className="font-semibold text-gray-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                Date
              </Label>
              <Popover open={openCalendar} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between h-11 text-gray-700 border-gray-300 rounded-md shadow-sm hover:border-blue-400">
                    {editData.date
                      ? dayjs(editData.date).format("DD/MM/YYYY")
                      : "Select date"}
                    <ChevronDownIcon className="w-4 h-4 text-blue-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="p-3 w-[18rem] sm:w-[22rem] shadow-lg rounded-xl bg-white">
                  <Calendar
                    mode="single"
                    className="w-72"
                    selected={editData.date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      handleChange({
                        target: {
                          name: "date",
                          value: date ?? new Date(),
                        },
                      } as any);
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
              value={data.birdAgeInDays}
              onChange={handleChange}
              icon={<Activity className="w-4 h-4 text-blue-600" />}
            />
          </div>

          {/* Feed & Mortality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Today's Consumed Bags"
              name="feedConsumedBags"
              type="number"
              value={data.feedConsumedBags}
              onChange={handleChange}
              icon={<Package className="w-4 h-4 text-green-600" />}
            />

            <InputField
              label="Today's Mortality"
              name="mortalityCount"
              type="number"
              value={data.mortalityCount}
              onChange={handleChange}
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5 border-t px-6 py-4 bg-gray-50 rounded-b-2xl">
          <Button
            onClick={onClose}
            type="button"
            variant="secondary"
            className="w-full sm:w-40 bg-gray-400 text-white font-medium hover:bg-gray-500 transition-all">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isEditing}
            className="w-full sm:w-40 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all">
            {isEditing ? "Saving..." : "Submit"}
          </Button>
        </div>
      </form>

      {/* Spinner Overlay */}
      {(isEditing || isDeleting) && (
        <>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-40 rounded-2xl"></div>
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <Spinner />
          </div>
        </>
      )}

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={isDeleteDialogOen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Deletion"
        description="Are you sure you want to delete this record? This cannot be undone."
      />
    </div>
  );
};

export default EditDailyRecordModal;
