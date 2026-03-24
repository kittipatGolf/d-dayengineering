"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const result = await login(username.trim(), password);

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(result.user?.role === "Admin" ? "/homeadmin" : "/");
  }

  return (
    <section className="grid min-h-[80vh] place-items-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:grid-cols-2">
        {/* Left side - branding */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 p-12 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <span className="text-lg font-black tracking-tight">DD</span>
            </div>
            <h2 className="mt-8 text-4xl font-bold leading-tight">
              ยินดีต้อนรับ
              <br />
              <span className="text-blue-300">กลับมา</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-200/80">
              เข้าสู่ระบบเพื่อจัดการคำสั่งซื้อ ติดตามงานซ่อม และเข้าถึงบริการทั้งหมดของดีเดย์ ประตูม้วน
            </p>
          </div>
          <p className="relative text-xs text-blue-200/50">D-Day Engineering &mdash; Smart Service Platform</p>
        </div>

        {/* Right side - form */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/25">
              <span className="text-xs font-black text-white">DD</span>
            </div>
            <span className="text-lg font-bold text-slate-900">D-Day Engineering</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">เข้าสู่ระบบ</h1>
          <p className="mt-2 text-sm text-slate-500">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UserIcon className="h-4 w-4 text-slate-400" />
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrorMessage("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <LockClosedIcon className="h-4 w-4 text-slate-400" />
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/requestreset" className="text-sm text-blue-600 transition hover:text-blue-700 hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            {errorMessage && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
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
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
