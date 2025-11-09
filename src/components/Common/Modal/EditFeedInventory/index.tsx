import { useEffect, useState, type ChangeEvent } from "react";
import {
  CalendarDays,
  Package,
  User,
  Phone,
  ChevronDownIcon,
  Trash2,
} from "lucide-react";
import dayjs from "dayjs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQueryClient } from "@tanstack/react-query";
import type { DailyRecordFormData, FeedInventoryFormData } from "@/types";
import InputField from "../../InputField";
import useUpdateFeedInventory from "@/hooks/FeedInventory/useUpdateFeedInventory";
import useDeleteFeedInventory from "@/hooks/FeedInventory/useDeleteFeedInventory";
import DeleteAlertDialog from "../../DeleteAlertDialog";
import Spinner from "../../Spinner";

interface EditFeedInventoryModalProps {
  editData: FeedInventoryFormData;
  isOpen: boolean;
  onClose: () => void;
}

const EditFeedInventoryModal = ({
  editData,
  isOpen,
  onClose,
}: EditFeedInventoryModalProps) => {
  const [openCalendar, setCalendarOpen] = useState(false);

  const [data, setData] = useState<FeedInventoryFormData>({
    date: new Date(),
    feedName: "",
    bagsArrivedCount: "",
    driverName: "",
    driverPhoneNumber: "",
  });

  const queryClient = useQueryClient();
  const { mutate: updateFeedInventory, isPending: isEditing } = useUpdateFeedInventory();
  const { mutate: deleteFeedInventory, isPending: isDeleting } = useDeleteFeedInventory(
    editData.id
  );

  useEffect(() => {
    if (editData) {
      setData({
        date: editData.date,
        feedName: editData.feedName,
        bagsArrivedCount: editData.bagsArrivedCount,
        driverName: editData.driverName,
        driverPhoneNumber: editData.driverPhoneNumber,
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
      feedName: data.feedName,
      bagsArrivedCount: data.bagsArrivedCount,
      driverName: data.driverName,
      driverPhoneNumber: data.driverPhoneNumber,
    };

    updateFeedInventory(
      { id: editData.id, feedInventory: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["get-all-feedInventories"] });

          console.log("Data submited successfully");
          onClose();
        },

        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const handleDelete = async (id: number) => {
    deleteFeedInventory(
      { id },
      {
        onSuccess: () => {
          console.log("Data deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["get-all-feedInventories"],
          });
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          onClose();
        },

        onError: (error) => {
          console.log(error);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100 transition-all">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl shadow-sm">
          <h1 className="font-semibold text-lg sm:text-xl flex items-center gap-2">
            <Package className="w-5 h-5" />
            Edit Feed Record
          </h1>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm sm:text-base transition-all flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date */}
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
                  selected={editData.date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    handleChange({
                      target: {
                        name: "date",
                        value: date ?? new Date(),
                      },
                    });
                    setCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            <InputField
              label="Feed Name"
              name="feedName"
              type="text"
              value={data.feedName}
              onChange={handleChange}
              required
              icon={<Package className="w-4 h-4 text-blue-600" />}
            />

            <InputField
              label="Bags Arrived"
              name="bagsArrivedCount"
              type="number"
              value={data.bagsArrivedCount}
              onChange={handleChange}
              required
              icon={<Package className="w-4 h-4 text-green-600" />}
            />

            <InputField
              label="Driver Name"
              name="driverName"
              type="text"
              value={data.driverName}
              onChange={handleChange}
              icon={<User className="w-4 h-4 text-blue-600" />}
            />

            <InputField
              label="Driver Phone Number"
              name="driverPhoneNumber"
              type="number"
              value={data.driverPhoneNumber}
              onChange={handleChange}
              icon={<Phone className="w-4 h-4 text-indigo-600" />}
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

export default EditFeedInventoryModal;
