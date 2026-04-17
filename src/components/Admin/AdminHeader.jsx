import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminHeader.css";

const AdminHeader = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-header">
      <h2>{title}</h2>

      <button onClick={handleLogout} className="admin-header-logout">
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;