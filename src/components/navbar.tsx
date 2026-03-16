"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  InformationCircleIcon,
  PhotoIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart-context";
import { NotificationModal } from "@/app/homeadmin/components/notification/notification-modal";

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
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { totalItems } = useCart();
  const [openMenu, setOpenMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/notifications?target=user")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setUnreadCount(data.unreadCount); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetch("/api/notifications?target=user")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data) setUnreadCount(data.unreadCount); })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleUnreadChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const handleLogout = async () => {
    setOpenMenu(false);
    await logout();
    router.push("/login");
  };

  return (
    <>
    <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${scrolled ? "border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl" : "border-slate-200 bg-white"}`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/25">
            <span className="text-sm font-black tracking-tight text-white">DD</span>
          </div>
          <span className="hidden text-lg font-bold tracking-wide text-slate-900 sm:block">
            D-Day Engineering
          </span>
        </Link>

        {/* Desktop nav — no icons to save space */}
        <nav className="hidden min-w-0 items-center gap-0.5 xl:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden shrink-0 items-center gap-1.5 xl:flex">
          <Link
            href="/cart"
            className="relative inline-flex items-center rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="ตะกร้าสินค้า"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {isLoading ? null : user ? (
            <>
              <button
                type="button"
                onClick={() => setNotifOpen(true)}
                className="relative inline-flex items-center rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="การแจ้งเตือน"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {user.firstName?.charAt(0) ?? "U"}
                </div>
                <span className="hidden 2xl:inline">{user.firstName}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span className="hidden 2xl:inline">ออกจากระบบ</span>
                <span className="2xl:hidden">ออก</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        {/* Mobile / tablet hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 xl:hidden"
          onClick={() => setOpenMenu((prev) => !prev)}
          aria-label="เปิดปิดเมนู"
          aria-expanded={openMenu}
        >
          {openMenu ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {openMenu && (
        <nav className="animate-fade-in border-t border-slate-100 bg-white px-4 pb-5 pt-3 xl:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setOpenMenu(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-100" />

            <Link
              href="/cart"
              className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setOpenMenu(false)}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              ตะกร้า {totalItems > 0 && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{totalItems}</span>}
            </Link>

            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => { setOpenMenu(false); setNotifOpen(true); }}
                  className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50"
                >
                  <BellIcon className="h-5 w-5" />
                  แจ้งเตือน {unreadCount > 0 && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{unreadCount}</span>}
                </button>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setOpenMenu(false)}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  {user.firstName} {user.lastName}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-red-600"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700"
                onClick={() => setOpenMenu(false)}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>

    {user && (
      <NotificationModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        target="user"
        onUnreadChange={handleUnreadChange}
      />
    )}
    </>
  );
}
