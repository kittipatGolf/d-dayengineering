import { GlobeAltIcon } from "@heroicons/react/24/outline";

const contactRows = [
  { label: "ชื่อธุรกิจ", value: "ห้างหุ้นส่วนจำกัด ดี เดย์ ประตูม้วน" },
  {
    label: "ที่อยู่",
    value: (
      <>
        422/63 หมู่ที่ 5 ตำบลเขาคันทรง
        <br />
        อำเภอศรีราชา จังหวัดชลบุรี 20110
      </>
    ),
  },
  { label: "โทรศัพท์", value: "08-3015-1893, 08-6033-5224" },
  {
    label: "เว็บไซต์",
    value: (
      <a
        href="https://d-dayengineering.yellowpages.co.th"
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline hover:text-blue-700"
      >
        d-dayengineering.yellowpages.co.th
      </a>
    ),
  },
  { label: "เวลาทำการ", value: "ทำการทุกวัน เวลา 08:00-17:00 น." },
  { label: "พิกัด", value: "13.065418, 101.138217" },
  {
    label: "โซเชียลมีเดีย",
    value: (
      <a
        href="https://d-dayengineering.yellowpages.co.th/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600"
        aria-label="เปิดหน้าโซเชียลมีเดีย"
      >
        <GlobeAltIcon className="h-5 w-5" />
      </a>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-md border border-slate-200 bg-white p-4 md:p-6">
        <h1 className="mb-6 text-4xl font-bold text-slate-800">ติดต่อเรา</h1>

        <div className="overflow-hidden rounded-md border border-slate-200">
          {contactRows.map((row) => (
            <div key={row.label} className="grid border-b border-slate-200 bg-slate-50 last:border-b-0 md:grid-cols-[30%_1fr]">
              <div className="border-r border-slate-200 bg-slate-100 px-4 py-4 font-semibold text-slate-800">{row.label}</div>
              <div className="px-4 py-4 text-slate-700">{row.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4 md:p-6">
        <h2 className="mb-4 text-center text-4xl font-bold text-slate-800">แผนที่ตั้งของเรา</h2>

        <div className="relative h-[420px] overflow-hidden rounded-md border border-slate-200">
          <iframe
            title="แผนที่ตั้งของดีเดย์ประตูม้วน"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.532865830966!2d101.1381996!3d13.0653793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102c5d7963e7d5d%3A0xf8e82970dc2ad385!2z4Lir4LiI4LiBLuC4lOC4teC5gOC4lOC4ouC5jCDguJvguKPguLDguJXguLnguKHguYnguKfguJk!5e0!3m2!1sth!2sth!4v1772985309822!5m2!1sth!2sth"
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
