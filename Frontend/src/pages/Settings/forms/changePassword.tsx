import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";
import {FormInputField} from "@/components/FormField";

// 1️⃣ Zod Schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Password changed:", data);
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative ${loading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {loading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-emerald-600 mb-6">
            Change Password
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 p-2 rounded">
              Password changed successfully!
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit, (error) => {
              const msg =
                error.currentPassword?.message ||
                error.newPassword?.message ||
                error.confirmPassword?.message ||
                "Please correct the form.";
              setError(msg);
              setSuccess(false);
            })}
          >
            <FormInputField
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              placeholder="Current Password"
              register={register}
              error={errors.currentPassword}
              valueAsNumber={false}
            />
            <FormInputField
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="New Password"
              register={register}
              error={errors.newPassword}
              valueAsNumber={false}
            />
            <FormInputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm New Password"
              register={register}
              error={errors.confirmPassword}
              valueAsNumber={false}
            />

            <button
              type="submit"
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-md"
            >
              Update Password
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              to="/settings"
              className="text-emerald-600 hover:underline font-medium"
            >
              Back to Settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
