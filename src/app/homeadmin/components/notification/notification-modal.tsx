"use client";

import { BellIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationModalProps = {
  open: boolean;
  onClose: () => void;
  target: "admin" | "user";
  onUnreadChange?: (count: number) => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const typeLabels: Record<string, { label: string; color: string }> = {
  order: { label: "คำสั่งซื้อ", color: "bg-blue-100 text-blue-700" },
  repair: { label: "แจ้งซ่อม", color: "bg-amber-100 text-amber-700" },
  status: { label: "สถานะ", color: "bg-emerald-100 text-emerald-700" },
  user: { label: "ผู้ใช้", color: "bg-violet-100 text-violet-700" },
};

export function NotificationModal({ open, onClose, target, onUnreadChange }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?target=${target}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        onUnreadChange?.(data.unreadCount);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [target, onUnreadChange]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true, target }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onUnreadChange?.(0);
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      onUnreadChange?.(updated.filter((n) => !n.isRead).length);
      return updated;
    });
  };

  if (!open) return null;

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">การแจ้งเตือน</h2>
            {unread > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
              >
                <CheckIcon className="h-4 w-4" />
                อ่านทั้งหมด
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="ปิด"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">กำลังโหลด...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">ไม่มีการแจ้งเตือน</div>
          ) : (
            <ul>
              {notifications.map((n) => {
                const typeInfo = typeLabels[n.type] ?? { label: n.type, color: "bg-slate-100 text-slate-600" };
                return (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 border-b border-slate-100 px-5 py-3 transition ${
                      n.isRead ? "bg-white" : "bg-blue-50/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-800">{n.title}</p>
                      <p className="text-sm text-slate-500">{n.message}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="mt-1 shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        title="อ่านแล้ว"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
