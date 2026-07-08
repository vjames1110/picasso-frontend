import { createElement } from "react";
import { FaBook, FaChartPie, FaClipboardList, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaChartPie },
  { to: "/admin/books", label: "Books", icon: FaBook },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
];

const AdminSidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen && <button className="admin-overlay" onClick={onClose} aria-label="Close admin navigation" />}
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`} aria-label="Admin navigation">
      <div>
        <div className="admin-logo">
          <div className="admin-logo-mark">P</div>
          <div><strong>Picasso</strong><span>Administration</span></div>
          <button onClick={onClose} aria-label="Close navigation"><FaTimes /></button>
        </div>
        <p className="admin-nav-label">Workspace</p>
        <nav className="admin-nav">
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `admin-link ${isActive ? "active" : ""}`} onClick={onClose}>
              {createElement(icon)}<span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="admin-sidebar-footer"><span>Store manager</span><strong>Picasso Publications</strong></div>
    </aside>
  </>
);

export default AdminSidebar;
