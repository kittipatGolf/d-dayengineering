import Link from "next/link";

export default function RequestResetPage() {
  return (
    <section className="grid min-h-[75vh] place-items-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-10">
        <h1 className="text-center text-4xl font-bold text-sky-600">ลืมรหัสผ่าน</h1>
        <p className="mt-8 text-center text-2xl text-slate-500">กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>

        <form className="mx-auto mt-10 w-full max-w-2xl space-y-6">
          <div>
            <label htmlFor="email" className="mb-3 block text-2xl font-semibold text-black">อีเมล</label>
            <input
              id="email"
              type="email"
              placeholder="อีเมลของคุณ"
              className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-2xl text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-sky-600 px-4 py-3 text-2xl font-semibold text-white transition hover:bg-sky-500"
          >
            ส่งคำขอ
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-2xl text-slate-500 underline hover:text-slate-700">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </section>
  );
}
