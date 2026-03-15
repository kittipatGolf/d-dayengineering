"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useAuth, type AuthUser } from "@/lib/auth/auth-context";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: AuthUser | null;
  onSuccess?: () => void;
};

const inputClassName =
  "w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100";

export function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const { setUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhone(user.phone ?? "");
      setEmail(user.email ?? "");
      setError("");
      setSuccess("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!firstName || !lastName || !phone) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        setIsSubmitting(false);
        return;
      }

      // Update auth context with new user data
      if (data.user) {
        setUser(data.user);
      } else if (user) {
        setUser({ ...user, firstName, lastName, phone, email });
      }

      setSuccess("บันทึกข้อมูลสำเร็จ");
      setTimeout(() => {
        setSuccess("");
        onSuccess?.();
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
          <h2 className="text-2xl sm:text-[32px] font-bold text-slate-700">แก้ไขโปรไฟล์</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิด"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div>
            <label htmlFor="first-name" className="mb-1 block font-semibold text-slate-700">
              * ชื่อ
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="ชื่อ"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setError(""); }}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="last-name" className="mb-1 block font-semibold text-slate-700">
              * นามสกุล
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="นามสกุล"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setError(""); }}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block font-semibold text-slate-700">
              * เบอร์โทรศัพท์
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="08x-xxx-xxxx"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); }}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block font-semibold text-slate-700">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className={inputClassName}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      </div>
    </div>
  );
}
