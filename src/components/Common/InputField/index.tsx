import type { ChangeEvent, ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label?: string;
  name: string;
  value: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode; // ✅ icon type added
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
  icon,
  onChange,
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label
        htmlFor={name}
        className="font-medium text-base text-gray-700 flex items-center gap-2">
        {icon && <span className="text-blue-600">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full appearance-none border border-gray-300 rounded-md h-10 pl-3 pr-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
        />
      </div>
    </div>
  );
};

export default InputField;
