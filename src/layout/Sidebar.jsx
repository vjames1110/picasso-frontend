import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        📚 Picasso Publications
        <span>Admin</span>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className="admin-link">
          Dashboard
        </NavLink>

        <NavLink to="/" className="admin-link">
          Back to Store
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;