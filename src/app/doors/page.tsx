import { CategoryFilterPanel } from "@/components/category-filter-panel";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";

const categories = [
  "ทั้งหมด",
  "ประตูม้วนแบบไฟฟ้า",
  "ประตูม้วนแบบรอกโซ่",
  "ประตูม้วนแบบมือดึง",
];

const doorProducts = [
  {
    title: "ประตูม้วนไฟฟ้า",
    description: "เหมาะกับโรงงาน โกดัง และศูนย์กระจายสินค้า",
    detailsTitle: "ประตูม้วนแบบไฟฟ้า",
    features: [
      "เหมาะสำหรับร้านค้าและอาคารพาณิชย์",
      "ใช้งานง่าย เปิด-ปิดสะดวก",
      "รองรับการควบคุมผ่านรีโมท",
    ],
    price: "ราคาขึ้นอยู่กับขนาด",
    imageClassName: "from-zinc-500 via-zinc-700 to-zinc-900",
  },
  {
    title: "ประตูม้วนมือดึง",
    description: "ใช้งานด้วยมือ ดูแลง่าย เหมาะกับร้านค้าและอาคารทั่วไป",
    detailsTitle: "ประตูม้วนแบบมือดึง",
    features: [
      "เหมาะกับโรงงาน โกดัง และศูนย์การค้า",
      "เปิด-ปิดได้แม้ไม่มีระบบไฟฟ้า",
      "โครงสร้างแข็งแรง ทนทาน",
    ],
    price: "ราคาขึ้นอยู่กับขนาด",
    imageClassName: "from-neutral-500 via-neutral-700 to-slate-900",
  },
  {
    title: "ประตูม้วนรอกโซ่",
    description: "เหมาะกับช่องเปิดขนาดใหญ่ ใช้งานทนทาน",
    detailsTitle: "ประตูม้วนแบบรอกโซ่",
    features: [
      "เหมาะกับโรงงานขนาดกลาง-ใหญ่",
      "ใช้งานด้วยมือ หมดปัญหาไฟดับ",
      "มีระบบล็อกเสริมความปลอดภัย",
    ],
    price: "ราคาขึ้นอยู่กับขนาด",
    imageClassName: "from-gray-400 via-slate-600 to-gray-800",
  },
  {
    title: "ประตูม้วนรอกโซ่",
    description: "เหมาะกับช่องเปิดขนาดใหญ่ ใช้งานทนทาน",
    detailsTitle: "ประตูม้วนแบบรอกโซ่",
    features: [
      "เหมาะกับโรงงานขนาดกลาง-ใหญ่",
      "ใช้งานด้วยมือ หมดปัญหาไฟดับ",
      "มีระบบล็อกเสริมความปลอดภัย",
    ],
    price: "ราคาขึ้นอยู่กับขนาด",
    imageClassName: "from-gray-400 via-slate-600 to-gray-800",
  },
];

export default function DoorsPage() {
  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-center text-4xl font-bold text-slate-900">ประตูม้วน</h1>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-4">
          <SearchBar className="max-w-none" />
          <CategoryFilterPanel title="ชนิดของประตูม้วน" items={categories} activeItem={categories[0]} />
        </aside>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {doorProducts.map((product) => (
            <ProductCard
              key={product.title}
              title={product.title}
              description={product.description}
              detailsTitle={product.detailsTitle}
              features={product.features}
              price={product.price}
              imageClassName={product.imageClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
