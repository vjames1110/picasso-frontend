import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h2>📚 Picasso Admin Panel</h2>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;