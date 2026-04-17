import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-left">
          <h3>Picasso Publications</h3>
          <p>Your trusted ebook store</p>
        </div>

        <div className="footer-center">
          <p>© 2026 Picasso Publications</p>
        </div>

        <div className="footer-right">
          <span
            className="admin-link"
            onClick={() => navigate("/admin/login")}
          >
            Admin Login
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;