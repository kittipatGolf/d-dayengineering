"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  InformationCircleIcon,
  PhotoIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "หน้าแรก", href: "/", icon: HomeIcon },
  { label: "ประตูม้วน", href: "/doors", icon: WrenchScrewdriverIcon },
  { label: "อะไหล่ประตูม้วน", href: "/parts", icon: Cog6ToothIcon },
  { label: "แจ้งซ่อม", href: "/repair", icon: WrenchScrewdriverIcon },
  { label: "เกี่ยวกับเรา", href: "/about", icon: InformationCircleIcon },
  { label: "ผลงานของเรา", href: "/portfolio", icon: PhotoIcon },
  { label: "ติดต่อเรา", href: "/contact", icon: ChatBubbleLeftRightIcon },
];

export function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 md:gap-4 md:px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 px-1 py-1"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
            DD
          </span>
          <span className="hidden text-[18px] font-semibold tracking-wide text-slate-900 sm:block">
            D-Day Engineering
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-4 md:-ml-8 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none ${
                  active
                    ? "rounded-full bg-sky-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                } text-[18px]`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 justify-self-end md:block">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-[18px] font-semibold text-white transition hover:bg-sky-600"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Login
          </Link>
        </div>

        <button
          type="button"
          className="justify-self-end inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          onClick={() => setOpenMenu((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {openMenu ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </div>

      {openMenu && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-sky-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setOpenMenu(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
              onClick={() => setOpenMenu(false)}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
