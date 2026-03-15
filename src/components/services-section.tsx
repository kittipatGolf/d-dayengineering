import Link from "next/link";
import {
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
  },
  {
    title: "ประตูม้วนรอกโซ่ / มือดึง",
    description:
      "ประตูม้วนแบบรอกโซ่และมือดึง ราคาประหยัด ทนทาน เหมาะกับโกดัง ร้านค้า และอาคารพาณิชย์",
    icon: CogIcon,
    href: "/doors",
  },
  {
    title: "บริการซ่อมบำรุง",
    description:
      "รับแจ้งซ่อมประตูม้วนทุกชนิด ทั้งระบบไฟฟ้า มอเตอร์ สปริง โซ่ รอก และแผ่นประตู โดยช่างผู้ชำนาญ",
    icon: WrenchScrewdriverIcon,
    href: "/repair",
  },
  {
    title: "จำหน่ายอะไหล่",
    description:
      "อะไหล่ประตูม้วนครบวงจร มอเตอร์ รีโมท สวิตช์ สปริง โซ่ รอก และอุปกรณ์อื่นๆ พร้อมจัดส่งทั่วประเทศ",
    icon: TruckIcon,
    href: "/parts",
  },
];

export function ServicesSection() {
  return (
    <section className="w-full space-y-6">
      <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-4xl">
        บริการของเรา
      </h2>
      <p className="mx-auto max-w-2xl text-center text-slate-500">
        D-Day Engineering ให้บริการด้านประตูม้วนครบวงจร
        ทั้งจำหน่าย ติดตั้ง ซ่อมบำรุง และอะไหล่
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc, i) => (
          <Link
            key={svc.title}
            href={svc.href}
            className="animate-fade-in-up group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svc.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              {svc.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">
              {svc.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
