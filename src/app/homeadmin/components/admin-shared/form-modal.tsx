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
        <div className={`w-full overflow-hidden rounded-2xl bg-white shadow-2xl ${maxWidthClassName ?? "max-w-5xl"}`}>
          {/* gradient header */}
          <div className="relative bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <h2 id="form-modal-title" className="text-lg font-bold text-white">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="ปิดโมดอล"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">{footer}</div>
        </div>
      </div>
    </>
  );
}
