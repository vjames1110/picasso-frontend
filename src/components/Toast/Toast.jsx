import { FaCheck, FaExclamation, FaInfo, FaTimes } from "react-icons/fa";
import { createElement, useEffect } from "react";
import "./Toast.css";

const getToastType = (message = "") => {
  const text = message.toLowerCase();
  if (/fail|invalid|unable|error|expired|out of stock/.test(text)) return "error";
  if (/success|sent|saved|added|updated|copied|available|verified|resent/.test(text)) return "success";
  return "info";
};

const Toast = ({ message, show, onClose }) => {
  const type = getToastType(message);
  const Icon = type === "success" ? FaCheck : type === "error" ? FaExclamation : FaInfo;
  const title = type === "success" ? "Done" : type === "error" ? "Something went wrong" : "Notice";

  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(onClose, 3200);
    return () => clearTimeout(timeout);
  }, [message, onClose, show]);

  return (
    <div className={`toast toast-${type} ${show ? "show" : ""}`} role="status" aria-live="polite" aria-hidden={!show}>
      <div className="toast-icon">{createElement(Icon)}</div>
      <div className="toast-copy"><strong>{title}</strong><span>{message}</span></div>
      <button onClick={onClose} aria-label="Dismiss notification"><FaTimes /></button>
      <div className="toast-progress" />
    </div>
  );
};

export default Toast;
