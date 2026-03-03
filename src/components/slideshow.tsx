"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

type Slide = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  background: string;
};

const slides: Slide[] = [
  {
    title: "บริการติดตั้งประตูม้วนครบวงจร",
    description: "ติดตั้งประตูม้วนไฟฟ้าและมือดึง งานเรียบร้อย แข็งแรง ใช้งานทน",
    href: "/doors",
    cta: "ดูบริการประตูม้วน",
    icon: WrenchScrewdriverIcon,
    background: "from-sky-600 via-cyan-600 to-blue-700",
  },
  {
    title: "อะไหล่แท้ พร้อมทีมติดตั้ง",
    description: "มีอะไหล่ครบทุกชิ้นส่วน พร้อมเปลี่ยนและดูแลหลังการติดตั้ง",
    href: "/parts",
    cta: "ดูอะไหล่ทั้งหมด",
    icon: Cog6ToothIcon,
    background: "from-indigo-600 via-blue-700 to-slate-800",
  },
  {
    title: "ซ่อมด่วนถึงหน้างาน",
    description: "แก้ปัญหาประตูติดขัด มอเตอร์เสีย และระบบควบคุมไม่ทำงาน",
    href: "/repair",
    cta: "แจ้งซ่อมทันที",
    icon: ShieldCheckIcon,
    background: "from-emerald-600 via-teal-700 to-cyan-800",
  },
  {
    title: "ปรึกษางานและขอประเมินราคา",
    description: "ทีมงานพร้อมให้คำแนะนำหน้างาน พร้อมประเมินงบประมาณอย่างชัดเจน",
    href: "/contact",
    cta: "ติดต่อเรา",
    icon: PhoneIcon,
    background: "from-orange-500 via-amber-600 to-yellow-700",
  },
];

export function SlideShow() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];
  const CurrentIcon = currentSlide.icon;

  return (
    <section className="w-full rounded-3xl p-1 md:p-1">
      <div
        className={`relative min-h-[360px] overflow-hidden rounded-2xl bg-gradient-to-r ${currentSlide.background} p-8 text-white md:min-h-[420px] md:p-10`}
      >
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl pl-10 md:pl-14">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <CurrentIcon className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            {currentSlide.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            {currentSlide.description}
          </p>
          <Link
            href={currentSlide.href}
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-sky-100"
          >
            {currentSlide.cta}
          </Link>
        </div>

        <button
          type="button"
          className="absolute left-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/25 p-2 text-white backdrop-blur transition hover:bg-white/35 md:left-5"
          onClick={() =>
            setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/25 p-2 text-white backdrop-blur transition hover:bg-white/35"
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 rounded-full transition ${
              index === activeSlide ? "w-8 bg-sky-600" : "w-2.5 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
