import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader title="Admin Panel" />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;