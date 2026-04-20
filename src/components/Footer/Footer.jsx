import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* LEFT */}
        <div className="footer-left">
          <h3>Picasso Publications</h3>
          <p>All Rights Reserved</p>
        </div>


        {/* CENTER */}
        <div className="footer-center">
          <a
            href="https://smartsightanalytics.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
          >
            @ Developed by Smart Sight Analytics, Bilaspur
          </a>
        </div>


        {/* RIGHT */}
        <div className="footer-right">

          <div className="social-icons">

            <a
              href="https://www.facebook.com/picasso.bilaspur"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/picasso_publication_cg?igsh=bG9zMTBvZWYzNGZp"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>

          </div>

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