import {
  BuildingOffice2Icon,
  ClockIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const contactCards = [
  {
    icon: BuildingOffice2Icon,
    title: "ชื่อธุรกิจ",
    lines: ["ห้างหุ้นส่วนจำกัด ดี เดย์ ประตูม้วน"],
  },
  {
    icon: MapPinIcon,
    title: "ที่อยู่",
    lines: [
      "422/63 หมู่ที่ 5 ตำบลเขาคันทรง",
      "อำเภอศรีราชา จังหวัดชลบุรี 20110",
    ],
  },
  {
    icon: PhoneIcon,
    title: "โทรศัพท์",
    lines: ["083-015-1893", "086-033-5224"],
    action: { label: "โทรเลย", href: "tel:0830151893" },
  },
  {
    icon: ClockIcon,
    title: "เวลาทำการ",
    lines: ["ทำการทุกวัน", "เวลา 08:00 - 17:00 น."],
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-8">
      {/* Hero header */}
      <section className="animate-fade-in overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-8 py-14 text-center text-white md:px-14 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <PhoneIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold md:text-5xl">ติดต่อเรา</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">
              พร้อมให้คำปรึกษาและบริการทุกวัน ไม่ว่าจะเป็นงานติดตั้ง ซ่อมบำรุง หรือสั่งซื้ออะไหล่
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {contactCards.map((card, i) => (
          <div
            key={card.title}
            className="animate-fade-in-up group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <card.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-sm font-bold text-slate-900">{card.title}</h3>
            {card.lines.map((line) => (
              <p key={line} className="text-sm text-slate-600">{line}</p>
            ))}
            {card.action && (
              <a
                href={card.action.href}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <PhoneIcon className="h-3.5 w-3.5" />
                {card.action.label}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Social & website */}
      <section className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">เว็บไซต์และโซเชียล</h3>
            <a
              href="https://d-dayengineering.yellowpages.co.th"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              <GlobeAltIcon className="h-4 w-4" />
              d-dayengineering.yellowpages.co.th
            </a>
          </div>
          <a
            href="https://d-dayengineering.yellowpages.co.th/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-sky-600"
          >
            <GlobeAltIcon className="h-4 w-4" />
            เยี่ยมชมเว็บไซต์
          </a>
        </div>
      </section>

      {/* Map */}
      <section className="animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <MapPinIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">แผนที่ตั้งของเรา</h2>
            <p className="text-xs text-slate-500">พิกัด: 13.065418, 101.138217</p>
          </div>
        </div>
        <div className="relative h-72 sm:h-96 md:h-120">
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
