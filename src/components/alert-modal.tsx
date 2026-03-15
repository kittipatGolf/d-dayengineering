"use client";

import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

type AlertModalProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  variant?: "error" | "warning" | "info";
};

const variants = {
  error: {
    icon: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700",
  },
  info: {
    icon: "bg-blue-100 text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

export function AlertModal({ open, message, onClose, variant = "error" }: AlertModalProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const style = variants[variant];

  useEffect(() => {
    if (open) btnRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:text-slate-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.icon}`}>
            <ExclamationTriangleIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">{message}</p>
          <button
            ref={btnRef}
            type="button"
            onClick={onClose}
            className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow transition ${style.button}`}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}
