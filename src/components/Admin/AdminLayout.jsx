import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="admin-main">
        <AdminHeader onMenu={() => setIsOpen(true)} />
        <div className="admin-content"><Outlet /></div>
      </div>
    </div>
  );
};

export default AdminLayout;
