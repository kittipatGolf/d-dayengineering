"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

type RegisterForm = {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const initialForm: RegisterForm = {
  username: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function getPasswordScore(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordScore = getPasswordScore(form.password);
  const passwordStrengthClass =
    passwordScore <= 1
      ? "w-1/5 bg-red-500"
      : passwordScore === 2
        ? "w-2/5 bg-orange-500"
        : passwordScore === 3
          ? "w-3/5 bg-yellow-500"
          : passwordScore === 4
            ? "w-4/5 bg-sky-500"
            : "w-full bg-emerald-500";

  const passwordHint =
    passwordScore === 0
      ? "กรอกรหัสผ่าน"
      : passwordScore <= 2
        ? "ความปลอดภัยต่ำ"
        : passwordScore <= 4
          ? "ความปลอดภัยปานกลาง"
          : "ความปลอดภัยสูง";

  function handleChange<K extends keyof RegisterForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateForm(data: RegisterForm): FormErrors {
    const nextErrors: FormErrors = {};

    if (!/^[A-Za-z0-9_]{4,20}$/.test(data.username)) {
      nextErrors.username = "ชื่อผู้ใช้ต้องเป็นอังกฤษ/ตัวเลข/ขีดล่าง 4-20 ตัว";
    }
    if (!data.firstName.trim()) {
      nextErrors.firstName = "กรุณากรอกชื่อ";
    }
    if (!data.lastName.trim()) {
      nextErrors.lastName = "กรุณากรอกนามสกุล";
    }
    if (!/^0\d{9}$/.test(data.phone)) {
      nextErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(data.password)) {
      nextErrors.password = "รหัสผ่านต้องอย่างน้อย 8 ตัว และมีทั้งตัวอักษรอังกฤษกับตัวเลข";
    }
    if (data.confirmPassword !== data.password) {
      nextErrors.confirmPassword = "ยืนยันรหัสผ่านไม่ตรงกัน";
    }

    return nextErrors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    // TODO: connect register API
  }

  return (
    <section className="grid min-h-[75vh] place-items-center py-4 sm:py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8 md:p-10">
        <h1 className="text-center text-3xl font-bold text-sky-600 sm:text-4xl">สมัครสมาชิก</h1>

        <form className="mt-6 space-y-4 sm:space-y-5" noValidate onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="mb-1 inline-flex items-center gap-2 font-semibold text-slate-900">
              <UserIcon className="h-5 w-5" />
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={form.username}
              onChange={(event) => handleChange("username", event.target.value)}
              className="w-full rounded border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.username ? <p className="mt-1 text-sm text-red-600">{errors.username}</p> : null}
          </div>

          <div>
            <label htmlFor="firstName" className="mb-1 inline-flex items-center gap-2 font-semibold text-slate-900">
              <UserIcon className="h-5 w-5" />
              ชื่อ
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="ชื่อภาษาไทย"
              value={form.firstName}
              onChange={(event) => handleChange("firstName", event.target.value)}
              className="w-full rounded border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.firstName ? <p className="mt-1 text-sm text-red-600">{errors.firstName}</p> : null}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-1 inline-flex items-center gap-2 font-semibold text-slate-900">
              <UserIcon className="h-5 w-5" />
              นามสกุล
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="นามสกุลภาษาไทย"
              value={form.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              className="w-full rounded border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.lastName ? <p className="mt-1 text-sm text-red-600">{errors.lastName}</p> : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block font-semibold text-slate-900">
              เบอร์โทรศัพท์
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="เบอร์โทรศัพท์"
              inputMode="numeric"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full rounded border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 inline-flex items-center gap-2 font-semibold text-slate-900">
              <EnvelopeIcon className="h-5 w-5" />
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              placeholder="ที่อยู่อีเมล"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 inline-flex items-center gap-2 font-semibold text-slate-900">
              <LockClosedIcon className="h-5 w-5" />
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่านภาษาอังกฤษและตัวเลขอย่างน้อย 8 ตัว"
                value={form.password}
                onChange={(event) => handleChange("password", event.target.value)}
                className="w-full rounded border border-slate-300 px-4 py-2.5 pr-11 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
            <div className="mt-2 h-2 rounded bg-slate-200">
              <div className={`h-full rounded transition-all duration-200 ${passwordStrengthClass}`} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{passwordHint}</p>
            {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 inline-flex items-center gap-2 font-semibold text-slate-900">
              <LockClosedIcon className="h-5 w-5" />
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่าน"
                value={form.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                className="w-full rounded border border-slate-300 px-4 py-2.5 pr-11 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                aria-label={showConfirmPassword ? "ซ่อนยืนยันรหัสผ่าน" : "แสดงยืนยันรหัสผ่าน"}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword ? <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p> : null}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded bg-sky-600 py-2.5 font-semibold text-white transition hover:bg-sky-500"
          >
            สมัครสมาชิก
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-slate-400 underline hover:text-slate-500">
            ย้อนกลับ
          </Link>
        </div>
      </div>
    </section>
  );
}
