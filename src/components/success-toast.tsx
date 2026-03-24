"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

type SuccessToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export function SuccessToast({ message, onClose, duration = 2500 }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
    >
      <CheckCircleIcon className="h-5 w-5 shrink-0" />
      {message}
    </div>
  );
}
