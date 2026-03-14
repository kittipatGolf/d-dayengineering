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
      <div className="fixed inset-0 z-40 bg-black/35" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
        <div className={`w-full rounded-2xl bg-white shadow-2xl ${maxWidthClassName ?? "max-w-5xl"}`}>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
              aria-label="ปิดโมดอล"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">{footer}</div>
        </div>
      </div>
    </>
  );
}
