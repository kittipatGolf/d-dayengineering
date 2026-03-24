"use client";

import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
};

const variants = {
  danger: {
    icon: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700",
  },
};

export function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  variant = "danger",
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const style = variants[variant];

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => { if (e.key === "Escape") onCancel(); }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="ปิด"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:text-slate-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.icon}`}>
            <ExclamationTriangleIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">{message}</p>

          <div className="mt-5 flex w-full gap-3">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow transition ${style.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
