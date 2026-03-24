import Link from "next/link";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const quickLinks = [
  { label: "หน้าแรก", href: "/" },
  { label: "ประตูม้วน", href: "/doors" },
  { label: "อะไหล่", href: "/parts" },
  { label: "แจ้งซ่อม", href: "/repair" },
  { label: "ผลงาน", href: "/portfolio" },
  { label: "เกี่ยวกับเรา", href: "/about" },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-linear-to-b from-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <span className="text-sm font-black tracking-tight">DD</span>
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">ดีเดย์</p>
                <p className="text-sm font-medium leading-tight text-slate-400">ประตูม้วน</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              จำหน่ายและติดตั้งประตูม้วนทุกชนิด ใช้วัสดุคุณภาพ ราคาไม่แพง
              พร้อมบริการซ่อมบำรุงและอะไหล่ครบวงจร
            </p>
            <p className="text-xs text-slate-500">หจก. ดีเดย์ ประตูม้วน (สำนักงานใหญ่)</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
              ลิงก์ด่วน
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
              ติดต่อเรา
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span className="text-sm text-slate-400">
                  422/63 หมู่ 5 ต.เขาคันทรง อ.ศรีราชา จ.ชลบุรี 20110
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 shrink-0 text-blue-400" />
                <div className="text-sm">
                  <a href="tel:0830151893" className="text-slate-400 transition hover:text-white">083-015-1893</a>
                  <span className="mx-1.5 text-slate-600">|</span>
                  <a href="tel:0860335224" className="text-slate-400 transition hover:text-white">086-033-5224</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-blue-400" />
                <a
                  href="mailto:Ddayshutter@hotmail.com"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Ddayshutter@hotmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
              เวลาทำการ
            </h4>
            <div className="flex items-start gap-3">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <div className="text-sm text-slate-400">
                <p>จันทร์ - เสาร์</p>
                <p className="mt-1 text-lg font-bold text-white">08:30 - 17:30 น.</p>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
              >
                <PhoneIcon className="h-4 w-4" />
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-slate-500 sm:flex-row md:px-8">
          <p>&copy; {new Date().getFullYear()} ดีเดย์ ประตูม้วน — All Rights Reserved</p>
          <p>ทะเบียนการค้า 0203551006260</p>
        </div>
      </div>
    </footer>
  );
}
