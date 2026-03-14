"use client";

import { Bars3Icon, PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const onLogout = () => {
    setProfileMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-blue-900 px-4 py-3 text-white shadow-sm md:px-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-lg p-2 text-blue-50 transition hover:bg-blue-800"
          aria-label="เปิดเมนูผู้ดูแลระบบ"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="rounded-lg px-2 py-1 text-right leading-tight transition hover:bg-blue-800"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
          >
            <p className="text-sm font-semibold">เทสแอดมิน เทสแอดมิน</p>
            <p className="text-base text-blue-200">Admin</p>
          </button>

          {profileMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
              >
                <PowerIcon className="h-5 w-5 text-slate-500" />
                <span className="text-lg">Logout</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

