import React from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

const AdminPage: React.FC = () => {
  const location = useLocation();

  // Check if we're on the exact admin root path
  const isRootPath = location.pathname === "/admin";

  return isRootPath ? <AdminDashboard /> : null;
};

export default AdminPage;
