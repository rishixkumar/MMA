import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg
      ${type === "success" ? "bg-emerald-500 text-white" : type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}
      animate-fade-in`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 text-white font-bold" onClick={onClose} aria-label="Close toast">×</button>
      )}
    </div>
  );
};

export default Toast;
