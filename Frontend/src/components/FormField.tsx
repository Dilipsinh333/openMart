// FormInputField.tsx
import type { FieldValues } from "react-hook-form";
import type { FormFieldProps } from "@/types";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  id: string;
  name: string;
  placeholder: string;
  options: { label: string; value: string }[];
  required?: boolean;
  register: any;
  error?: any;
};

const FormDropdown: React.FC<DropdownProps> = ({
  id,
  name,
  placeholder,
  options,
  required,
  register,
  error,
}) => {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {placeholder}
      </label>
      <select
        id={id}
        {...register(name)}
        required={required}
        className="appearance-none rounded relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom Arrow Icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <ChevronDown className="w-4 h-4" />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

const FormInputField = <T extends FieldValues>({
  id,
  name,
  type,
  required,
  placeholder,
  register,
  error,
  valueAsNumber,
}: FormFieldProps<T>) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {placeholder}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        {...register(name, valueAsNumber ? { valueAsNumber } : {})}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export { FormInputField, FormDropdown };
