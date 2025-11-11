import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "@/components/Loader";
import { FormInputField } from "@/components/FormField"; // assuming it's styled for your form
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

// 1️⃣ Zod Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  contact: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export type ContactData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.register.loading);

  // 2️⃣ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  // 3️⃣ Form submission handler
  const onSubmit = (data: ContactData) => {
    setSuccess(true);
    setError("");

    // Example action call — replace with your functionality
    // dispatch(
    //   updatePersonalInfo({ name: data.name, email: data.email, password: "" })
    // );
    console.log(data);

    setTimeout(() => {
      navigate("/thank-you");
    }, 1500);
  };

  return (
    <div
      className={`relative ${loading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {loading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-emerald-600 mb-6">
            Update Personal Info
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 p-2 rounded">
              Thanks for reaching out! We’ll get back to you soon.
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit, (err) => {
              const msg =
                err.name?.message ||
                err.email?.message ||
                err.contact?.message ||
                "Please correct the form.";
              setError(msg);
              setSuccess(false);
            })}
          >
            {/* Name Field */}
            <FormInputField
              id="name"
              name="name"
              type="text"
              required
              placeholder="Full Name"
              register={register}
              error={errors.name}
              valueAsNumber={false}
            />

            {/* Email Field */}
            <FormInputField
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email Address"
              register={register}
              error={errors.email}
              valueAsNumber={false}
            />

            {/* Contact Number Field */}
            <FormInputField
              id="contact"
              name="contact"
              type="text"
              required
              placeholder="Contact Number"
              register={register}
              error={errors.contact}
              valueAsNumber={false}
            />

            <button
              type="submit"
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-md"
            >
              Save
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already submitted?{" "}
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
