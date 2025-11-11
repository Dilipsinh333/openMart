import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery } from "@/features/auth/authApi";
import { loginSuccess, logout } from "@/features/auth/authSlice";
import type { RootState } from "@/store";
import Loader from "@/components/Loader";

const ProtectedRoute: React.FC = () => {
  const dispatch = useDispatch();
  const { data: meData, isLoading, isError } = useGetMeQuery();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.userId);

  // Sync RTK Query data into Redux auth slice
  useEffect(() => {
    if (meData?.user) {
      dispatch(
        loginSuccess({
          role: meData.user.role,
          userId: meData.user.userId,
          email: meData.user.email,
        })
      );
    } else if (isError) {
      dispatch(logout());
    }
  }, [meData, isError, dispatch]);

  // While getMe is loading, show a loader
  if (isLoading) {
    return <Loader />;
  }

  // After loading, if there is no authenticated user, redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route
  return <Outlet />;
};

export default ProtectedRoute;
