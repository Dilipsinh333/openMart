import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "@/features/auth/authApi";
import { useGetWishlistQuery } from "@/features/wishlist/wishlistApi";
import { loginSuccess, logout } from "@/features/auth/authSlice";
import { setWishlistItems, clearWishlist } from "@/features/wishlist/wishlistSlice";
import type { RootState } from "@/store";

const App = () => {
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.userId
  );

  // Single call for getMe
  const { data: meData, error: meError, isLoading: meLoading, isError: meIsError } = useGetMeQuery();

  // Wishlist only if logged in
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Sync user data into Redux
  useEffect(() => {
    if (meData?.user) {
      dispatch(
        loginSuccess({
          role: meData.user.role,
          userId: meData.user.userId,
          email: meData.user.email,
        })
      );
    }
  }, [meData, dispatch]);
  
  // Sync wishlist into Redux
  useEffect(() => {
    if (wishlistData && isAuthenticated) {
      dispatch(setWishlistItems(wishlistData));
    }
  }, [wishlistData, isAuthenticated, dispatch]);

  // Clear wishlist on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearWishlist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div>
      <Navbar />
      <AppRoutes />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName={() =>
          "bg-white text-gray-800 border-l-4 border-emerald-500 shadow-lg px-4 py-3 rounded-md inline-block max-w-xs sm:max-w-sm md:max-w-md"
        }
      />
    </div>
  );
};

export default App;
