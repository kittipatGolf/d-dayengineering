import { Bars3Icon } from "@heroicons/react/24/outline";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
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

        <div className="text-right leading-tight">
          <p className="text-sm font-semibold">เทสแอดมิน เทสแอดมิน</p>
          <p className="text-base text-blue-200">Admin</p>
        </div>
      </div>
    </header>
  );
}
