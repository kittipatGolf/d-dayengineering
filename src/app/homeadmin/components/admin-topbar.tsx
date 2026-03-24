"use client";

import { Bars3Icon, BellIcon, PowerIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { NotificationModal } from "./notification/notification-modal";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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

  useEffect(() => {
    fetch("/api/notifications?target=admin")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setUnreadCount(data.unreadCount); })
      .catch((err) => console.error("Failed to fetch admin notifications:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/notifications?target=admin")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data) setUnreadCount(data.unreadCount); })
        .catch((err) => console.error("Failed to fetch admin notifications:", err));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUnreadChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const onLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : "...";
  const initials = user ? (user.firstName?.charAt(0) ?? "A") : "A";

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="เปิดเมนูผู้ดูแลระบบ"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/25">
                <span className="text-xs font-black text-white">DD</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">D-Day Admin</p>
                <p className="text-[11px] text-slate-400">ระบบจัดการหลังบ้าน</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              title="ไปหน้าเว็บไซต์"
            >
              <HomeIcon className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="การแจ้งเตือน"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="mx-1 h-6 w-px bg-slate-200" />

            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {initials}
                </div>
                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                  <p className="text-[11px] text-slate-400">{user?.role ?? ""}</p>
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
                    <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                    <p className="text-xs text-slate-400">{user?.role ?? ""}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <PowerIcon className="h-4 w-4" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <NotificationModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        target="admin"
        onUnreadChange={handleUnreadChange}
      />
    </>
  );
}
