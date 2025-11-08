import type { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  label,
  name,
  value,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
  onChange,
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={name} className="text-base font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`appearance-none border border-gray-300 rounded-md h-10 pl-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

export default InputField;
