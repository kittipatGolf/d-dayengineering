"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckCircleIcon,
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

const strengthConfig = [
  { class: "w-1/5 bg-red-500", label: "ความปลอดภัยต่ำมาก", color: "text-red-500" },
  { class: "w-1/5 bg-red-500", label: "ความปลอดภัยต่ำ", color: "text-red-500" },
  { class: "w-2/5 bg-orange-500", label: "ความปลอดภัยพอใช้", color: "text-orange-500" },
  { class: "w-3/5 bg-yellow-500", label: "ความปลอดภัยปานกลาง", color: "text-yellow-600" },
  { class: "w-4/5 bg-blue-500", label: "ความปลอดภัยดี", color: "text-blue-500" },
  { class: "w-full bg-emerald-500", label: "ความปลอดภัยสูง", color: "text-emerald-500" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordScore = getPasswordScore(form.password);
  const strength = strengthConfig[passwordScore];

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "เกิดข้อผิดพลาด");
        setIsSubmitting(false);
        return;
      }

      router.push("/");
    } catch {
      setApiError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      setIsSubmitting(false);
    }
  }

  function InputField({
    id,
    label,
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    inputMode,
  }: {
    id: keyof RegisterForm;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    inputMode?: "numeric" | "text" | "email" | "tel";
  }) {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Icon className="h-4 w-4 text-slate-400" />
          {label}
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <section className="grid min-h-[80vh] place-items-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[380px_1fr]">
        {/* Left side - branding */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 p-10 text-white lg:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <span className="text-lg font-black tracking-tight">DD</span>
            </div>
            <h2 className="mt-8 text-3xl font-bold leading-tight">
              สร้างบัญชี
              <br />
              <span className="text-blue-300">ใหม่</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-200/80">
              สมัครสมาชิกเพื่อเข้าถึงบริการทั้งหมด สั่งซื้อสินค้า และติดตามงานซ่อมได้ง่ายๆ
            </p>
          </div>
          <div className="relative space-y-3">
            <div className="flex items-center gap-3 text-sm text-blue-200/70">
              <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              สั่งซื้อสินค้าและอะไหล่ออนไลน์
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-200/70">
              <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              แจ้งซ่อมและติดตามสถานะ
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-200/70">
              <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              รับการแจ้งเตือนอัพเดทงาน
            </div>
          </div>
        </div>

        {/* Right side - form */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Mobile header */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/25">
              <span className="text-xs font-black text-white">DD</span>
            </div>
            <span className="text-lg font-bold text-slate-900">D-Day Engineering</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">สมัครสมาชิก</h1>
          <p className="mt-2 text-sm text-slate-500">กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีใหม่</p>

          <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
            <InputField id="username" label="ชื่อผู้ใช้" icon={UserIcon} placeholder="เช่น john_doe" value={form.username} onChange={(v) => handleChange("username", v)} error={errors.username} />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField id="firstName" label="ชื่อ" icon={UserIcon} placeholder="ชื่อภาษาไทย" value={form.firstName} onChange={(v) => handleChange("firstName", v)} error={errors.firstName} />
              <InputField id="lastName" label="นามสกุล" icon={UserIcon} placeholder="นามสกุลภาษาไทย" value={form.lastName} onChange={(v) => handleChange("lastName", v)} error={errors.lastName} />
            </div>

            <InputField id="phone" label="เบอร์โทรศัพท์" icon={PhoneIcon} type="tel" placeholder="0xx-xxx-xxxx" value={form.phone} onChange={(v) => handleChange("phone", v.replace(/\D/g, "").slice(0, 10))} error={errors.phone} inputMode="numeric" />

            <InputField id="email" label="อีเมล" icon={EnvelopeIcon} type="email" placeholder="example@email.com" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} />

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <LockClosedIcon className="h-4 w-4 text-slate-400" />
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="อย่างน้อย 8 ตัว มีตัวอักษรและตัวเลข"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`}
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
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.class}`} />
                  </div>
                  <p className={`mt-1 text-xs font-medium ${strength.color}`}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <LockClosedIcon className="h-4 w-4 text-slate-400" />
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showConfirmPassword ? "ซ่อนยืนยันรหัสผ่าน" : "แสดงยืนยันรหัสผ่าน"}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            {apiError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {apiError}
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
                  กำลังสมัคร...
                </>
              ) : (
                <>
                  สมัครสมาชิก
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
