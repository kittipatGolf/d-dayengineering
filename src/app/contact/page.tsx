import {
  BuildingOffice2Icon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const contactCards = [
  {
    icon: BuildingOffice2Icon,
    title: "ชื่อธุรกิจ",
    lines: ["บริษัท ดีย์แปด ประตูม้วน จำกัด", "DEE8 SHUTTER DOOR CO., LTD"],
  },
  {
    icon: MapPinIcon,
    title: "ที่อยู่",
    lines: [
      "40/7 ม.2 ต.มาบยางพร",
      "อ.ปลวกแดง จ.ระยอง 21140",
    ],
  },
  {
    icon: PhoneIcon,
    title: "โทรศัพท์",
    lines: ["091-834-8666", "062-545-0777"],
    action: { label: "โทรเลย", href: "tel:0918348666" },
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

      {/* Map */}
      <section className="animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <MapPinIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">แผนที่ตั้งของเรา</h2>
            <p className="text-xs text-slate-500">พิกัด: 12.965026, 101.165106</p>
          </div>
        </div>
        <div className="relative h-72 sm:h-96 md:h-120">
          <iframe
            title="แผนที่ตั้งของดีย์แปดประตูม้วน"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3886.0!2d101.165106!3d12.965026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU3JzU0LjEiTiAxMDHCsDA5JzU0LjQiRQ!5e0!3m2!1sth!2sth"
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
