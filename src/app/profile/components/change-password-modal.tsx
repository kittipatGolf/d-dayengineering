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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!oldPassword || !newPassword) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        setIsSubmitting(false);
        return;
      }

      setSuccess("เปลี่ยนรหัสผ่านสำเร็จ");
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setSuccess("");
        onClose();
      }, 1500);
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[540px] rounded-md bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-[32px] font-bold text-slate-700">เปลี่ยนรหัสผ่าน</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิด"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="rounded border border-slate-300">
          <p className="border-b border-slate-300 px-4 py-3 text-slate-700">กรุณากรอกรหัสผ่าน</p>
          <div className="space-y-6 p-4">
            <div>
              <label htmlFor="old-password" className="mb-2 block font-semibold text-slate-700">
                รหัสผ่านเก่า
              </label>
              <div className="relative">
                <input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="รหัสผ่านเก่า"
                  value={oldPassword}
                  onChange={(e) => { setOldPassword(e.target.value); setError(""); }}
                  className="w-full rounded border border-slate-300 px-4 py-2 pr-11 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <button
                  type="button"
                  aria-label="สลับการแสดงรหัสผ่านเก่า"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showOldPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="mb-2 block font-semibold text-slate-700">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัว มีตัวอักษร+ตัวเลข)"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  className="w-full rounded border border-slate-300 px-4 py-2 pr-11 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <button
                  type="button"
                  aria-label="สลับการแสดงรหัสผ่านใหม่"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full rounded bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
            >
              {isSubmitting ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
