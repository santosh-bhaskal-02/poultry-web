"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

interface HybridDatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
}

const HybridDatePicker = ({ label = "Date", value, onChange }: HybridDatePickerProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    if (!isNaN(selectedDate.getTime())) {
      onChange(selectedDate);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <Label htmlFor="date" className="font-medium text-gray-700 flex items-center gap-2">
        <CalendarDays className="text-blue-500 w-5 h-5" />
        {label}
      </Label>

      {!isEditing ? (
        <Button
          variant="outline"
          id="date"
          onClick={() => setIsEditing(true)}
          className="h-11 w-full sm:w-44 justify-between font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
          {value ? dayjs(value).format("DD/MM/YYYY") : "Select date"}
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      ) : (
        <input
          type="date"
          id="date"
          value={dayjs(value).format("YYYY-MM-DD")}
          onChange={handleInputChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="appearance-none border border-gray-300 rounded-md h-11 px-3 w-full sm:w-44 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
};

export default HybridDatePicker;
