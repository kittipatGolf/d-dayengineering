import Link from "next/link";
import {
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  CogIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BoltIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const reasons = [
  {
    icon: CurrencyDollarIcon,
    title: "ราคายุติธรรม",
    text: "มีแบบประตูม้วนหลายแบบให้เลือกตามหน้างานและงบประมาณ",
  },
  {
    icon: ShieldCheckIcon,
    title: "วัสดุคุณภาพ",
    text: "เลือกใช้อุปกรณ์และวัสดุคุณภาพมาตรฐาน ติดตั้งแข็งแรง ใช้งานได้จริง",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "ช่างมืออาชีพ",
    text: "ทีมช่างประสบการณ์สูง พร้อมเครื่องมือครบ งานเรียบร้อย เปิด-ปิดลื่น",
  },
  {
    icon: ClockIcon,
    title: "ยืดหยุ่นเวลา",
    text: "ติดตั้งนอกเวลาทำการได้ ลดผลกระทบต่อธุรกิจและการทำงานประจำวัน",
  },
  {
    icon: MapPinIcon,
    title: "บริการทั่วถึง",
    text: "มีผลงานติดตั้งในชลบุรี ระยอง และพื้นที่ใกล้เคียงมากกว่า 10 ปี",
  },
];

const services = [
  {
    icon: BoltIcon,
    title: "สินค้าและติดตั้ง",
    items: [
      "ประตูม้วนแบบมือดึง และประตูม้วนสแตนเลส",
      "ประตูม้วนแบบรอกโซ่",
      "ประตูม้วนไฟฟ้าเปิดด้วยรีโมท หรือประตูม้วนอัตโนมัติ",
    ],
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "รับซ่อมทุกระบบ",
    items: [
      "แก้ไขประตูม้วน เปิดไม่ขึ้น ปิดไม่ลง หรือชุดขับเสียหาย",
      "ซ่อมมอเตอร์ประตูม้วนไฟฟ้า มอเตอร์ไม่ทำงาน",
      "แก้ปัญหาเสียงดัง รางคด ฝืด ติดขัด ล็อกไม่อยู่",
      "ซ่อมประตูม้วนที่เสียหายจากการชนกระแทก",
      "แปลงประตูม้วนมือดึงเป็นไฟฟ้า-รีโมท",
    ],
  },
  {
    icon: CogIcon,
    title: "จำหน่ายอะไหล่",
    items: [
      "จำหน่ายกล่องประตูม้วน",
      "จำหน่ายมอเตอร์ประตูม้วนทุกรุ่น มีประกันสินค้า",
      "จำหน่ายอะไหล่ประตูม้วนทุกระบบ",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="animate-fade-in overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative min-h-100 bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 p-8 md:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative mx-auto flex min-h-[320px] max-w-5xl flex-col items-center justify-center text-center text-white">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <CheckBadgeIcon className="h-9 w-9" />
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              ดีย์แปดประตูม้วน
            </h1>
            <p className="mt-2 text-lg font-medium text-blue-200 md:text-2xl">
              ผู้เชี่ยวชาญงานประตูม้วนทุกระบบและประตูรั้วโรงงาน
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
              เราติดตั้งประตูม้วนได้ทุกแบบที่ลูกค้าต้องการ เช่น ประตูม้วนไฟฟ้า-รีโมท ประตูม้วนรอกโซ่ ประตูม้วนมือดึง
              โดยเน้นงานคุณภาพ ราคาเหมาะสม และรับประกันผลงาน
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
              >
                <PhoneIcon className="h-5 w-5" />
                ติดต่อเรา
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                ดูผลงานของเรา
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Reasons */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900 md:text-4xl">
          5 เหตุผลหลัก
        </h2>
        <p className="mb-8 text-center text-slate-500">
          ที่ลูกค้าเลือกดีย์แปดประตูม้วน
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="animate-fade-in-up group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-slate-900">{r.title}</h3>
              <p className="text-xs leading-relaxed text-slate-500">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand highlight */}
      <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-linear-to-br from-blue-50 via-white to-sky-50 p-8 text-center shadow-sm md:p-12">
        <p className="text-4xl font-black tracking-tight text-blue-700 sm:text-6xl">ดีย์แปด</p>
        <p className="text-3xl font-black text-slate-900 sm:text-5xl">ประตูม้วน</p>
        <div className="mx-auto mt-6 max-w-3xl">
          <h3 className="text-xl font-bold text-slate-800 md:text-2xl">
            ประตูม้วนดีมีคุณภาพ ช่างประตูม้วนดีมีฝีมือ
          </h3>
          <p className="mt-3 text-slate-600 md:text-lg">
            บริษัท ดีย์แปด ประตูม้วน จำกัด เลขที่ผู้เสียภาษี 0215568001551
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg">
            <PhoneIcon className="h-5 w-5" />
            <span className="text-lg font-bold md:text-xl">091-834-8666, 062-545-0777</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">ติดต่อได้ทุกวัน</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-4xl">
          สินค้าและบริการ
        </h2>
        <p className="mx-auto -mt-6 mb-8 max-w-3xl text-center text-slate-500">
          จำหน่ายและรับติดตั้งประตูเหล็กม้วน ประตูม้วนสแตนเลส Roller Shutter ทุกระบบ ทุกขนาด
          โดยทีมช่างในพื้นที่ศรีราชา บ่อวิน ปลวกแดง และระยอง
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className="animate-fade-in-up rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <svc.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{svc.title}</h3>
              </div>
              <ul className="space-y-2">
                {svc.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckBadgeIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why us CTA */}
      <section className="animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 p-8 text-center text-white md:p-14">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-5xl">ทำไมต้องเลือกเรา?</h2>
            <p className="mx-auto mt-5 max-w-4xl text-lg text-white/80 md:text-xl">
              เพราะเราเลือกใช้วัสดุคุณภาพ ติดตั้งโดยช่างผู้ชำนาญมากกว่า 20 ปี
              ส่งมอบงานคุณภาพจริง ไม่ทิ้งงาน เก็บรายละเอียดครบ ตรงเวลา ในราคาที่สมเหตุสมผล
            </p>
            <p className="mx-auto mt-3 max-w-4xl text-base text-white/60">
              ให้บริการครอบคลุมพื้นที่: บ่อวิน, ปลวกแดง, ระยอง และพื้นที่ใกล้เคียง
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-bold text-blue-900 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
            >
              <PhoneIcon className="h-5 w-5" />
              ติดต่อเราเลย
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
