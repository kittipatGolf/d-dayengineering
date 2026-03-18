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
                <span className="text-sm font-black tracking-tight">D8</span>
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">ดีย์แปด</p>
                <p className="text-sm font-medium leading-tight text-slate-400">ประตูม้วน</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              จำหน่ายและติดตั้งประตูม้วนทุกชนิด ใช้วัสดุคุณภาพ ราคาไม่แพง
              พร้อมบริการซ่อมบำรุงและอะไหล่ครบวงจร
            </p>
            <p className="text-xs text-slate-500">บริษัท ดีย์แปด ประตูม้วน จำกัด (สำนักงานใหญ่)</p>
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
                  40/7 ม.2 ต.มาบยางพร อ.ปลวกแดง จ.ระยอง 21140
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 shrink-0 text-blue-400" />
                <div className="text-sm">
                  <a href="tel:0918348666" className="text-slate-400 transition hover:text-white">091-834-8666</a>
                  <span className="mx-1.5 text-slate-600">|</span>
                  <a href="tel:0625450777" className="text-slate-400 transition hover:text-white">062-545-0777</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-blue-400" />
                <a
                  href="mailto:d8shutterdoor@gmail.com"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  d8shutterdoor@gmail.com
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
                <p>ทำการทุกวัน</p>
                <p className="mt-1 text-lg font-bold text-white">08:00 - 17:00 น.</p>
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
          <p>&copy; {new Date().getFullYear()} บริษัท ดีย์แปด ประตูม้วน จำกัด — All Rights Reserved</p>
          <p>เลขที่ผู้เสียภาษี 0215568001551</p>
        </div>
      </div>
    </footer>
  );
}
