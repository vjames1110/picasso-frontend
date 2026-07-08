import { FaBars, FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminHeader.css";

const pageNames = {
  "/admin/dashboard": ["Dashboard", "A quick view of store performance"],
  "/admin/books": ["Book catalogue", "Add and manage publication inventory"],
  "/admin/orders": ["Orders", "Review purchases and update fulfilment"],
};

const AdminHeader = ({ onMenu }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [title, subtitle] = pageNames[pathname] || ["Admin panel", "Picasso Publications"];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button className="admin-menu-button" onClick={onMenu} aria-label="Open admin navigation"><FaBars /></button>
        <div><h1>{title}</h1><p>{subtitle}</p></div>
      </div>
      <div className="admin-header-actions">
        <button className="admin-store-link" onClick={() => navigate("/")}><FaExternalLinkAlt /><span>View store</span></button>
        <button className="admin-header-logout" onClick={handleLogout}><FaSignOutAlt /><span>Logout</span></button>
      </div>
    </header>
  );
};

export default AdminHeader;
