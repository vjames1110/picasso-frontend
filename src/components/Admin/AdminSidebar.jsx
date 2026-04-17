import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminSidebar.css";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleLinkClick = () => {
    // close sidebar on mobile after clicking
    if (window.innerWidth <= 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="admin-overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="admin-logo">
          Picasso Admin
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className="admin-link"
            onClick={handleLinkClick}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/books"
            className="admin-link"
            onClick={handleLinkClick}
          >
            Books
          </NavLink>

          <NavLink
            to="/admin/orders"
            className="admin-link"
            onClick={handleLinkClick}
          >
            Orders
          </NavLink>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;