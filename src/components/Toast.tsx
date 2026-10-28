"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  duration?: number; // milliseconds
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
      <div
        className={`mt-20 px-6 py-3 rounded-lg shadow-xl text-white font-semibold text-center pointer-events-auto transform transition-all duration-300 ease-out
          ${type === "success" ? "bg-green-500" : "bg-red-500"} animate-slide-in`}
      >
        {message}
      </div>
    </div>
  );
}
