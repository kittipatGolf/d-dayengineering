"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="grid min-h-[75vh] place-items-center py-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-700 p-10 text-white md:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              D-Day Engineering
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">Welcome Back</h2>
            <p className="mt-3 max-w-sm text-sm text-cyan-100/90">
              เข้าสู่ระบบเพื่อจัดการข้อมูลลูกค้า ติดตามงานซ่อม และดูสถานะงานติดตั้งแบบ real-time
            </p>
          </div>
          <p className="text-xs text-cyan-100/80">Smart service workflow for professional shutter teams.</p>
        </div>

        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-500">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>

          <form className="mt-8 space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border border-slate-300 text-sky-600 focus:ring-sky-300"
              />
              จดจำฉัน
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/register" className="text-sky-700 underline hover:text-sky-800">
              สมัครสมาชิก?
            </Link>
            <Link href="/contact" className="text-sky-700 underline hover:text-sky-800">
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
