"use client";

import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[540px] rounded-md bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-[32px] font-bold text-slate-700">เน€เธเธฅเธตเนเธขเธเธฃเธซเธฑเธชเธเนเธฒเธ</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="เธเธดเธ”"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="rounded border border-slate-300">
          <p className="border-b border-slate-300 px-4 py-3 text-slate-700">เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธฃเธซเธฑเธชเธเนเธฒเธ</p>
          <div className="space-y-6 p-4">
            <div>
              <label htmlFor="old-password" className="mb-2 block font-semibold text-slate-700">
                เธฃเธซเธฑเธชเธเนเธฒเธเน€เธเนเธฒ
              </label>
              <div className="relative">
                <input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="เธฃเธซเธฑเธชเธเนเธฒเธเน€เธเนเธฒ"
                  className="w-full rounded border border-slate-300 px-4 py-2 pr-11 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <button
                  type="button"
                  aria-label="เธชเธฅเธฑเธเธเธฒเธฃเนเธชเธ”เธเธฃเธซเธฑเธชเธเนเธฒเธเน€เธเนเธฒ"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showOldPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="mb-2 block font-semibold text-slate-700">
                เธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเน
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="เธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเน"
                  className="w-full rounded border border-slate-300 px-4 py-2 pr-11 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <button
                  type="button"
                  aria-label="เธชเธฅเธฑเธเธเธฒเธฃเนเธชเธ”เธเธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเน"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400"
            >
              เน€เธเธฅเธตเนเธขเธเธฃเธซเธฑเธชเธเนเธฒเธ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
