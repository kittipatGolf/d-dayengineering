import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-[#1778cf] text-white">
      <div className="mx-auto w-full px-4 py-12 md:px-8">
        <div className="grid items-center gap-8 text-center md:grid-cols-2 md:gap-10 xl:grid-cols-5">
          <div className="text-center">
            <div className="inline-flex h-28 w-28 flex-col items-center justify-center rounded-xl bg-white text-center shadow-lg">
              <span className="text-3xl font-black leading-none text-[#1778cf]">
                ดีเดย์
              </span>
              <span className="mt-1 text-lg font-bold leading-none text-slate-900">
                ประตูม้วน
              </span>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-[16px] font-bold leading-snug">
              หจก. ดีเดย์ ประตูม้วน (สำนักงานใหญ่)
            </h3>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-[14px] font-bold underline underline-offset-8">เกี่ยวกับเรา</h4>
            <p className="max-w-lg text-[12px] leading-7 text-white/95">
              จำหน่ายติดตั้งประตูม้วนไฟฟ้าลิ่ม ระยอง ติดตั้งประตูม้วนทุกชนิด ใช้งานสะดวก
              ใช้วัสดุคุณภาพ ราคาไม่แพง
            </p>
            <p className="text-[14px] font-extrabold tracking-wide">เบอร์โทร 083-015-1893</p>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-[14px] font-bold underline underline-offset-8">ติดต่อเรา</h4>
            <p className="text-[12px] leading-7 text-white/95">
              ดีเดย์ ประตูม้วน ระยอง
              <br />
              422/63 หมู่ 5 ต.เนินพระ อ.เมืองระยอง จ.ชลบุรี 20230
            </p>
            <p className="text-[14px] font-extrabold tracking-wide">เบอร์โทร 086-033-5224</p>
            <p className="text-[14px] font-semibold text-yellow-300">
              Email:{" "}
              <Link
                href="mailto:Ddayshutter@hotmail.com"
                className="underline underline-offset-4"
              >
                Ddayshutter@hotmail.com
              </Link>
            </p>
          </div>

          <div className="space-y-6 text-center">
            <h4 className="text-[14px] font-bold underline underline-offset-8">เวลาทำการ</h4>
            <p className="text-[12px] font-semibold">จันทร์-เสาร์</p>
            <p className="text-[14px] font-extrabold">เวลา 8:30 - 17:30 น.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/50 py-4 text-center text-sm text-white/90">
        © 2024 ดีเดย์ ประตูม้วน | All Rights Reserved
      </div>
    </footer>
  );
}
