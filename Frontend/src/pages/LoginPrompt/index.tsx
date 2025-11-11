import React from "react";
import { Link, useLocation } from "react-router-dom";

const LoginPrompt = () => {
  const location = useLocation();
  const message = location.state?.message || "Login to access this feature.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-xl font-bold mb-4">{message}</h1>

      <Link
        to="/login"
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Login
      </Link>
    </div>
  );
};

export default LoginPrompt;
