import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        Picasso Admin
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className="admin-link">
          Dashboard
        </NavLink>

        <NavLink to="/admin/books" className="admin-link">
          Books
        </NavLink>

        <NavLink to="/admin/orders" className="admin-link">
          Orders
        </NavLink>
      </nav>

      <button className="admin-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;