"use client";

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

type NotificationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function NotificationModal({ open, onClose }: NotificationModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-5xl rounded-md bg-white p-6 text-[16px] shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-slate-800">การแจ้งเตือน</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิดการแจ้งเตือน"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-[16px] text-slate-700">
                <th className="px-4 py-3 font-semibold">ข้อความ</th>
                <th className="px-4 py-3 font-semibold">วันที่</th>
                <th className="px-4 py-3 font-semibold">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 text-[16px] text-slate-600">
                <td className="px-4 py-5">ไม่มีการแจ้งเตือน</td>
                <td className="px-4 py-5">-</td>
                <td className="px-4 py-5">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="หน้าแรก">
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            </button>
            <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="ก่อนหน้า">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="ถัดไป">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="หน้าสุดท้าย">
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
