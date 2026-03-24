"use client";

import Link from "next/link";
import { useState } from "react";
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setError("กรุณากรอกอีเมล");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
      } else {
        setMessage(data.message);
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid min-h-[80vh] place-items-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-8 py-10 text-center text-white">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">ลืมรหัสผ่าน?</h1>
              <p className="mt-2 text-sm text-blue-200/80">
                ไม่ต้องกังวล กรอกอีเมลของคุณแล้วเราจะส่งลิงก์รีเซ็ตให้
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {message ? (
              <div className="animate-fade-in space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">ส่งอีเมลเรียบร้อย!</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="กรอกอีเมลที่ใช้สมัครสมาชิก"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      ส่งลิงก์รีเซ็ต
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {!message && (
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-blue-600"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
