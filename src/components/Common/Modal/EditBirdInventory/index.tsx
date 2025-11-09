import { useEffect, useState, type ChangeEvent } from "react";
import dayjs from "dayjs";
import * as React from "react";
import {
  CalendarDays,
  Hash,
  Package,
  Bird,
  Crosshair,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  Home,
  Activity,
  ChevronDownIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQueryClient } from "@tanstack/react-query";
import type { BirdInventoryFormData } from "@/types";
import InputField from "../../InputField";
import useDeleteBirdInventory from "@/hooks/BirdInventory/useDeleteBirdInventory";
import useUpdateBirdInventory from "@/hooks/BirdInventory/useUpdateBirdInventory";
import DeleteAlertDialog from "../../DeleteAlertDialog";
import Spinner from "../../Spinner";

interface EditBirdInventoryModalProps {
  editData: BirdInventoryFormData;
  isOpen: boolean;
  onClose: () => void;
}

const EditBirdInventoryModal = ({
  editData,
  isOpen,
  onClose,
}: EditBirdInventoryModalProps) => {
  const [openCalendar, setCalendarOpen] = useState(false);

  const [formData, setFormData] = useState<BirdInventoryFormData>({
    date: new Date(),
    batchNo: "",
    boxCount: "",
    birdsPerBoxCount: "",
    totalBirdCount: "",
    birdsArrivedCount: "",
    boxMortalityCount: "",
    disabledBirdCount: "",
    weakBirdCount: "",
    excessBirdCount: "",
    housedBirdCount: "",
  });

  const queryClient = useQueryClient();
  const { mutate: updateBirdInventory, isPending: isEditing } = useUpdateBirdInventory();
  const { mutate: deleteBirdInventory, isPending: isDeleting } = useDeleteBirdInventory(
    editData.id
  );

  useEffect(() => {
    if (editData) {
      setFormData({
        date: editData.date,
        batchNo: editData.batchNo,
        boxCount: editData.boxCount,
        birdsPerBoxCount: editData.birdsPerBoxCount,
        totalBirdCount: editData.totalBirdCount,
        birdsArrivedCount: editData.birdsArrivedCount,
        boxMortalityCount: editData.boxMortalityCount,
        disabledBirdCount: editData.disabledBirdCount,
        weakBirdCount: editData.weakBirdCount,
        excessBirdCount: editData.excessBirdCount,
        housedBirdCount: editData.housedBirdCount,
      });
    }
  }, [editData]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updateData = {
      ...formData,
      [name]: value,
    };
    setFormData(updateData);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: editData.id,
      date: formData.date,
      batchNo: formData.batchNo,
      boxCount: formData.boxCount,
      birdsPerBoxCount: formData.birdsPerBoxCount,
      totalBirdCount: formData.totalBirdCount,
      birdsArrivedCount: formData.birdsArrivedCount,
      boxMortalityCount: formData.boxMortalityCount,
      disabledBirdCount: formData.disabledBirdCount,
      weakBirdCount: formData.weakBirdCount,
      excessBirdCount: formData.excessBirdCount,
      housedBirdCount: formData.housedBirdCount,
    };

    updateBirdInventory(
      { id: editData.id, birdInventory: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["get-all-BirdInventories"] });

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
    deleteBirdInventory(
      { id },
      {
        onSuccess: () => {
          console.log("Data deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["get-all-BirdInventories"],
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleConfirm = () => {
    handleDelete(editData.id);
    setIsDeleteDialogOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-0"
      onClick={() => {
        onClose();
        setIsDeleteDialogOpen(false);
      }}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl shadow-sm">
          <h1 className="font-semibold text-lg sm:text-xl flex items-center gap-2">
            <Bird className="w-5 h-5" />
            Edit Bird Inventory
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

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Date + Batch Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date Picker */}
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
                  className="p-3 w-full sm:w-[22rem] shadow-lg rounded-xl bg-white">
                  <Calendar
                    mode="single"
                    selected={editData.date}
                    className="w-72"
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData((prev: BirdInventoryFormData) => ({
                        ...prev,
                        date: date ?? new Date(),
                      }));
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="batchNo"
                className="font-semibold text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-600" />
                Batch No
              </Label>
              <input
                id="batchNo"
                type="number"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                className="border-gray-300 border h-11 px-3 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter batch number"
              />
            </div>
          </div>

          {/* Bird Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <InputField
              label="No. of Boxes"
              name="boxCount"
              type="number"
              value={formData.boxCount}
              onChange={handleChange}
              icon={<Package className="w-4 h-4 text-blue-600" />}
            />
            <InputField
              label="Birds per Box"
              name="birdsPerBoxCount"
              type="number"
              value={formData.birdsPerBoxCount}
              onChange={handleChange}
              icon={<PlusCircle className="w-4 h-4 text-blue-600" />}
            />
            <InputField
              label="Total Birds"
              name="totalBirdCount"
              type="number"
              value={formData.totalBirdCount}
              onChange={handleChange}
              icon={<Bird className="w-4 h-4 text-blue-600" />}
            />
            <InputField
              label="Birds Arrived"
              name="birdsArrivedCount"
              type="number"
              value={formData.birdsArrivedCount}
              onChange={handleChange}
              icon={<Home className="w-4 h-4 text-blue-600" />}
            />
            <InputField
              label="Box Mortality"
              name="boxMortalityCount"
              type="number"
              value={formData.boxMortalityCount}
              onChange={handleChange}
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            />
            <InputField
              label="Disabled Birds"
              name="disabledBirdCount"
              type="number"
              value={formData.disabledBirdCount}
              onChange={handleChange}
              icon={<Crosshair className="w-4 h-4 text-orange-500" />}
            />
            <InputField
              label="Weak Birds"
              name="weakBirdCount"
              type="number"
              value={formData.weakBirdCount}
              onChange={handleChange}
              icon={<Activity className="w-4 h-4 text-yellow-500" />}
            />
            <InputField
              label="Excess Birds"
              name="excessBirdCount"
              type="number"
              value={formData.excessBirdCount}
              onChange={handleChange}
              icon={<PlusCircle className="w-4 h-4 text-green-500" />}
            />
            <InputField
              label="Birds Housed"
              name="housedBirdCount"
              type="number"
              value={formData.housedBirdCount}
              onChange={handleChange}
              icon={<Home className="w-4 h-4 text-green-600" />}
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

      {/* Spinner */}
      {(isEditing || isDeleting) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl z-50">
          <Spinner />
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Deletion"
        description="Are you sure you want to delete this record? This cannot be undone."
      />
    </div>
  );
};

export default EditBirdInventoryModal;
