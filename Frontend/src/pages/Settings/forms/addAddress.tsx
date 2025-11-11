import { FormInputField } from "@/components/FormField";
import Loader from "@/components/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import addAddressSchema from "@/validators/addAddressSchema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, User } from "lucide-react";

type addAddressData = z.infer<typeof addAddressSchema>;

import { useAddAddressMutation } from "@/features/address/addressApi";
import { toast } from "react-toastify";

const AddressesForm = () => {
  const navigate = useNavigate();
  const [addAddress, { isLoading }] = useAddAddressMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addAddressData>({ resolver: zodResolver(addAddressSchema) });

  const onSubmit = async (data: addAddressData) => {
    try {
      const { pinCode, ...rest } = data;
      const payload = {
        ...rest,
        pinCode: pinCode,
      };

      await addAddress(payload).unwrap();
      toast.success("Address added successfully!");
      reset();
      // Navigate back to address list after successful addition
      navigate("/settings/addresses");
    } catch (error: any) {
      let msg = "Failed to add address";
      if (error && typeof error === "object") {
        if (
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
        ) {
          msg = error.data.message;
        } else if ("message" in error) {
          msg = error.message;
        }
      }
      toast.error(msg);
    }
  };

  return (
    <div
      className={`relative ${isLoading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {isLoading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-t-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/30 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <button
                onClick={() => navigate("/settings/addresses")}
                className="absolute top-0 left-0 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-white/70 rounded-lg px-3 py-2 backdrop-blur-sm shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Addresses</span>
              </button>

              <div className="text-center pt-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                  Add New Address
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                  Fill in your delivery address details to get your orders
                  delivered safely
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl border border-white/20 p-8">
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInputField
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    register={register}
                    error={errors.fullName}
                    valueAsNumber={false}
                  />
                  <FormInputField
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    required
                    placeholder="Enter your phone number"
                    register={register}
                    error={errors.phoneNumber}
                    valueAsNumber={false}
                  />
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl p-6 border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  Address Details
                </h3>
                <div className="space-y-6">
                  <FormInputField
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    required
                    placeholder="House No, Building, Street Name"
                    register={register}
                    error={errors.addressLine1}
                    valueAsNumber={false}
                  />
                  <FormInputField
                    id="addressLine2"
                    name="addressLine2"
                    required={false}
                    type="text"
                    placeholder="Area, Landmark (Optional)"
                    register={register}
                    error={errors.addressLine2}
                    valueAsNumber={false}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInputField
                      id="city"
                      name="city"
                      type="text"
                      required
                      placeholder="City"
                      register={register}
                      error={errors.city}
                      valueAsNumber={false}
                    />
                    <FormInputField
                      id="state"
                      name="state"
                      type="text"
                      required
                      placeholder="State"
                      register={register}
                      error={errors.state}
                      valueAsNumber={false}
                    />
                    <FormInputField
                      id="pinCode"
                      name="pinCode"
                      type="text"
                      required
                      placeholder="PIN Code"
                      register={register}
                      error={errors.pinCode}
                      valueAsNumber={false}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-5 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving Address...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <MapPin className="w-5 h-5" />
                      <span>Save Address</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesForm;
