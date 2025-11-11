import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import registerSchema from "../../validators/registerSchema";
import { Link, useNavigate } from "react-router-dom";
import { FormDropdown, FormInputField } from "@/components/FormField";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "@/features/register/registerApi";
import { useDispatch } from "react-redux";
import { loginSuccess, loginError } from "@/features/auth/authSlice";
import type { AppDispatch } from "@/store";

type RegisterData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      const registerRequestBody = {
        name: data.name,
        email: data.email,
        password: data.password,
        userType: data.userType,
      };
      const result = await registerUser(registerRequestBody).unwrap();
      toast.success("Signup successful! Redirecting to home page...");

      // Update Redux state with user data from register response
      if (result && result.user) {
        dispatch(
          loginSuccess({
            role: result.user.userType, // Backend returns 'userType'
            userId: result.user.userId,
            email: result.user.email,
          })
        );
      }

      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Registration failed";
      toast.error(errorMessage);
      dispatch(loginError({ error: errorMessage }));
    }
  };

  return (
    <div
      className={`relative ${isLoading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {isLoading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-emerald-600 mb-6">
            Create your account
          </h2>

          {/* {error &&
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
              {error}
            </div>
            toast.error(error)}
          {success &&
            <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 p-2 rounded">
              Signup successful! Redirecting to login...
            </div>
            toast.success(success)} */}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            <FormInputField
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Email address"
              register={register}
              error={errors.email}
              valueAsNumber={false}
            />
            <FormInputField
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              register={register}
              error={errors.password}
              valueAsNumber={false}
            />
            <FormInputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              register={register}
              error={errors.confirmPassword}
              valueAsNumber={false}
            />

            <FormDropdown
              id="userType"
              name="userType"
              placeholder="Usertype"
              options={[
                { label: "Customer", value: "Customer" },
                { label: "Seller", value: "Seller" },
              ]}
              required={true}
              register={register}
              error={errors.userType}
            />

            <button
              type="submit"
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-md"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
