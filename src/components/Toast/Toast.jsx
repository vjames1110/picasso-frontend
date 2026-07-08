import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onClose, 2000);
      return () => clearTimeout(timeout);
    }
  }, [show, onClose]);

  return (
    <div className={`toast ${show ? "show" : ""}`}>
      {message}
    </div>
  );
};

export default Toast;
