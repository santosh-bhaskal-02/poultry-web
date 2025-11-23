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
  readOnly?: boolean;
  className?: string;
  min?: number;
  icon?: ReactNode;
  error?: string | false;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField = ({
  label,
  name,
  value,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  readOnly = false,
  className = "",
  icon,
  onChange,
  onBlur,
  min = 0,
  error,
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <Label
          htmlFor={name}
          className="font-medium text-base text-gray-700 flex items-center gap-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
          min={min}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full appearance-none border rounded-md h-10 
            ${icon ? "pl-10 pr-3" : "px-3"} 
            text-gray-700 placeholder-gray-400 
            focus:outline-none focus:ring-1 transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }
            ${
              disabled || readOnly
                ? "bg-gray-100 cursor-not-allowed text-gray-500"
                : "bg-white"
            }
          `}
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
