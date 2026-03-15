import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

type FormModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  maxWidthClassName?: string;
};

export function FormModal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidthClassName,
}: FormModalProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-modal-title"
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      >
        <div className={`w-full rounded-2xl bg-white shadow-2xl ${maxWidthClassName ?? "max-w-5xl"}`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 id="form-modal-title" className="text-lg font-bold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="ปิดโมดอล"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">{footer}</div>
        </div>
      </div>
    </>
  );
}
