"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-bold text-slate-900">เกิดข้อผิดพลาด</h2>
      <p className="text-slate-600">{error.message || "ไม่สามารถโหลดหน้านี้ได้"}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}
