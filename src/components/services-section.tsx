import Link from "next/link";
import {
  ArrowRightIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  CogIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const services = [
  {
    title: "ประตูม้วนไฟฟ้า",
    description:
      "จำหน่ายและติดตั้งประตูม้วนระบบไฟฟ้า พร้อมรีโมทคอนโทรล ใช้งานสะดวก ปลอดภัย เหมาะกับบ้าน โรงงาน และหน้าร้าน",
    icon: BoltIcon,
    href: "/doors",
    accent: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
  },
  {
    title: "ประตูม้วนรอกโซ่ / มือดึง",
    description:
      "ประตูม้วนแบบรอกโซ่และมือดึง ราคาประหยัด ทนทาน เหมาะกับโกดัง ร้านค้า และอาคารพาณิชย์",
    icon: CogIcon,
    href: "/doors",
    accent: "from-indigo-500 to-purple-600",
    iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
  },
  {
    title: "บริการซ่อมบำรุง",
    description:
      "รับแจ้งซ่อมประตูม้วนทุกชนิด ทั้งระบบไฟฟ้า มอเตอร์ สปริง โซ่ รอก และแผ่นประตู โดยช่างผู้ชำนาญ",
    icon: WrenchScrewdriverIcon,
    href: "/repair",
    accent: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    title: "จำหน่ายอะไหล่",
    description:
      "อะไหล่ประตูม้วนครบวงจร มอเตอร์ รีโมท สวิตช์ สปริง โซ่ รอก และอุปกรณ์อื่นๆ พร้อมจัดส่งทั่วประเทศ",
    icon: TruckIcon,
    href: "/parts",
    accent: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  },
];

export function ServicesSection() {
  return (
    <section className="w-full space-y-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Our Services</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
          บริการของเรา
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          ดีย์แปดประตูม้วน ให้บริการด้านประตูม้วนครบวงจร
          ทั้งจำหน่าย ติดตั้ง ซ่อมบำรุง และอะไหล่
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc, i) => (
          <Link
            key={svc.title}
            href={svc.href}
            className="animate-fade-in-up group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* top accent line */}
            <div className={`absolute left-0 right-0 top-0 h-1 bg-linear-to-r ${svc.accent}`} />

            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${svc.iconBg}`}>
              <svc.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              {svc.title}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-slate-500">
              {svc.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">
              ดูรายละเอียด
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
