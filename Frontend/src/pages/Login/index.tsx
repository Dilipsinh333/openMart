import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FormInputField } from "@/components/FormField";
import type { AppDispatch } from "../../store";
import { useLoginMutation, type LoginRequest } from "@/features/auth/authApi";
import { loginSuccess, loginError } from "@/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const result = await login(data).unwrap();
      toast.success("Login successful");

      // Update Redux state with user data from login response
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
        error?.data?.message || error?.message || "Login failed";
      toast.error(errorMessage);
      dispatch(loginError({ error: errorMessage }));
    }
  };

  return (
    <div
      className={`relative ${isLoading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-center text-2xl font-bold text-emerald-600 mb-6">
              Sign in to your account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex items-center justify-between text-sm text-gray-700">
                <label
                  htmlFor="remember-me"
                  className="flex items-center gap-2"
                >
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="accent-emerald-600"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-emerald-600 hover:text-emerald-500 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 py-2 px-4 rounded-xl text-white font-semibold transition duration-200 ${
                  isLoading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-emerald-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
