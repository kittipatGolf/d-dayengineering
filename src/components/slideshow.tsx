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
  subtitle: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  background: string;
};

const slides: Slide[] = [
  {
    title: "บริการติดตั้ง",
    subtitle: "ประตูม้วนครบวงจร",
    description: "ติดตั้งประตูม้วนไฟฟ้าและมือดึง งานเรียบร้อย แข็งแรง ใช้งานทน โดยทีมช่างมืออาชีพกว่า 20 ปี",
    href: "/doors",
    cta: "ดูบริการประตูม้วน",
    icon: WrenchScrewdriverIcon,
    background: "from-sky-600 via-cyan-600 to-blue-700",
  },
  {
    title: "อะไหล่แท้",
    subtitle: "พร้อมทีมติดตั้ง",
    description: "มีอะไหล่ครบทุกชิ้นส่วน มอเตอร์ รีโมท สปริง โซ่ รอก พร้อมเปลี่ยนและดูแลหลังการติดตั้ง",
    href: "/parts",
    cta: "ดูอะไหล่ทั้งหมด",
    icon: Cog6ToothIcon,
    background: "from-indigo-600 via-blue-700 to-slate-800",
  },
  {
    title: "ซ่อมด่วน",
    subtitle: "ถึงหน้างาน",
    description: "แก้ปัญหาประตูติดขัด มอเตอร์เสีย และระบบควบคุมไม่ทำงาน รับงานทุกวัน",
    href: "/repair",
    cta: "แจ้งซ่อมทันที",
    icon: ShieldCheckIcon,
    background: "from-emerald-600 via-teal-700 to-cyan-800",
  },
  {
    title: "ปรึกษางาน",
    subtitle: "และขอประเมินราคา",
    description: "ทีมงานพร้อมให้คำแนะนำหน้างาน พร้อมประเมินงบประมาณอย่างชัดเจน ไม่มีค่าใช้จ่าย",
    href: "/contact",
    cta: "ติดต่อเรา",
    icon: PhoneIcon,
    background: "from-orange-500 via-amber-600 to-yellow-700",
  },
];

const INTERVAL = 8000;

export function SlideShow() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const step = 50; // ms
    const increment = (step / INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((s) => (s + 1) % slides.length);
          return 0;
        }
        return prev + increment;
      });
    }, step);

    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };

  const currentSlide = slides[activeSlide];
  const CurrentIcon = currentSlide.icon;

  return (
    <section className="w-full">
      <div
        key={activeSlide}
        className={`animate-fade-in relative min-h-96 overflow-hidden rounded-3xl bg-linear-to-r ${currentSlide.background} text-white shadow-lg md:min-h-110`}
      >
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex min-h-96 flex-col justify-center px-10 py-12 md:min-h-110 md:px-16 lg:px-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <CurrentIcon className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {currentSlide.title}
              <br />
              <span className="text-white/90">{currentSlide.subtitle}</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {currentSlide.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={currentSlide.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90 hover:shadow-xl active:scale-[0.98]"
              >
                {currentSlide.cta}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                เกี่ยวกับเรา
              </Link>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          type="button"
          className="absolute left-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/30 md:left-5"
          onClick={() => goTo((activeSlide - 1 + slides.length) % slides.length)}
          aria-label="สไลด์ก่อนหน้า"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/30 md:right-5"
          onClick={() => goTo((activeSlide + 1) % slides.length)}
          aria-label="สไลด์ถัดไป"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-white/50 transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`ไปสไลด์ที่ ${index + 1}`}
            onClick={() => goTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeSlide ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
