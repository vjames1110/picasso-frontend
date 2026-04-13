import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      setTimeout(onClose, 2000);
    }
  }, [show]);

  return (
    <div className={`toast ${show ? "show" : ""}`}>
      {message}
    </div>
  );
};

export default Toast;