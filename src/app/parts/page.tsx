import { CategoryFilterPanel } from "@/components/category-filter-panel";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";

const partCategories = [
  "ทั้งหมด",
  "แผ่นประตูม้วน",
  "เสารางประตูม้วน",
  "แกนเพลาประตูม้วน",
  "กล่องเก็บม้วนประตู",
  "ตัวล็อกประตูม้วน",
  "กุญแจประตูม้วน",
  "รอกโซ่ประตูม้วน",
  "ชุดเฟืองโซ่ประตูม้วน",
  "โซ่ประตูม้วน",
  "ตัวล็อคโซ่สาว",
  "ชุดมอเตอร์ประตูม้วน",
  "สวิตช์กดควบคุม",
  "อื่นๆ",
];

const partProducts = [
  {
    title: "กุญแจประตูม้วน",
    description: "กุญแจสำหรับปลดล็อกและล็อกประตูม้วน เพื่อเพิ่มความปลอดภัย",
    price: "150 บาท",
    imageClassName: "from-amber-100 via-zinc-300 to-stone-500",
  },
  {
    title: "รอกโซ่ประตูม้วน รุ่น 1.5 ตัน",
    description: "รอกที่ช่วยทดแรงในการดึงโซ่เพื่อยกหรือปิดประตูม้วน",
    price: "8,000 บาท",
    imageClassName: "from-orange-300 via-amber-500 to-stone-700",
  },
  {
    title: "แผ่นประตูม้วน",
    description: "แผ่นโลหะที่ใช้เป็นตัวเปิด-ปิด ช่วยกันฝุ่น ลม และความร้อน",
    price: "60 บาท",
    imageClassName: "from-slate-200 via-slate-400 to-slate-700",
  },
  {
    title: "เสารางประตูม้วน",
    description: "รางนำทางที่ช่วยให้แผ่นประตูม้วนเลื่อนขึ้น-ลงได้อย่างราบรื่น",
    price: "500 บาท",
    imageClassName: "from-gray-300 via-gray-500 to-slate-700",
  },
  {
    title: "ชุดมอเตอร์ประตูม้วน",
    description: "มอเตอร์สำหรับระบบเปิด-ปิดอัตโนมัติ รองรับงานหนัก",
    price: "4,900 บาท",
    imageClassName: "from-slate-300 via-zinc-500 to-zinc-900",
  },
  {
    title: "ชุดเฟืองโซ่ประตูม้วน",
    description: "ชุดเฟืองและโซ่สำหรับส่งกำลังในการยกบานประตู",
    price: "1,200 บาท",
    imageClassName: "from-zinc-200 via-zinc-500 to-zinc-800",
  },
  {
    title: "สวิตช์กดควบคุม",
    description: "สวิตช์ควบคุมการเปิด-ปิดมอเตอร์แบบกดขึ้นลง",
    price: "650 บาท",
    imageClassName: "from-cyan-100 via-cyan-400 to-cyan-700",
  },
  {
    title: "แกนเพลาประตูม้วน",
    description: "แกนรับน้ำหนักหลักของชุดประตู เพิ่มความมั่นคงในการหมุน",
    price: "2,300 บาท",
    imageClassName: "from-slate-200 via-slate-500 to-slate-900",
  },
];

export default function PartsPage() {
  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-center text-4xl font-bold text-slate-900">อะไหล่ประตูม้วน</h1>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-4">
          <SearchBar className="max-w-none" />
          <CategoryFilterPanel title="ชนิดอะไหล่ประตูม้วน" items={partCategories} activeItem={partCategories[0]} />
        </aside>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] 2xl:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {partProducts.map((part) => (
            <ProductCard
              key={part.title}
              title={part.title}
              description={part.description}
              price={part.price}
              imageClassName={part.imageClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
