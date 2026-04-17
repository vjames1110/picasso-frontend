import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminHeader.css";

const AdminHeader = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <div className="admin-hamburger" onClick={toggleSidebar}>
          ☰
        </div>

        <h2>Admin Panel</h2>
      </div>

      <div className="admin-header-right">
        <button className="admin-header-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;