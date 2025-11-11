// FormData.ts
import type {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

export type ValidFieldNames =
  | "email"
  | "fullName"
  | "password"
  | "confirmPassword";

export type FormFieldProps<TFormValues extends FieldValues> = {
  id: string;
  name: Path<TFormValues>;
  type: string;
  required: boolean;
  placeholder: string;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
  valueAsNumber?: boolean;
};
