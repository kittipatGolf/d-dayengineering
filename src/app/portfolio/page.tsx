import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";

const portfolioItems = [
  {
    title: "ประตูม้วนแบบไฟฟ้า",
    description: "ผลงานการประกอบประตูไฟฟ้าของโรงงาน",
    price: "ผลงานติดตั้งจริง",
    imageClassName: "from-slate-300 via-slate-500 to-slate-700",
  },
  {
    title: "ประตูม้วนแบบรอกโซ่",
    description: "ผลงานประกอบประตูม้วนแบบรอกโซ่",
    price: "ผลงานติดตั้งจริง",
    imageClassName: "from-zinc-300 via-zinc-500 to-zinc-700",
  },
  {
    title: "ประตูม้วนมือดึง",
    description: "งานติดตั้งสำหรับร้านค้าและอาคารพาณิชย์",
    price: "ผลงานติดตั้งจริง",
    imageClassName: "from-slate-200 via-slate-400 to-slate-600",
  },
  {
    title: "ประตูม้วนโกดังสินค้า",
    description: "งานติดตั้งประตูม้วนสำหรับคลังสินค้า",
    price: "ผลงานติดตั้งจริง",
    imageClassName: "from-gray-300 via-gray-500 to-gray-700",
  },
];

export default function PortfolioPage() {
  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-center text-4xl font-bold text-slate-900">ผลงานของเรา</h1>

      <div className="ml-auto w-full max-w-md">
        <SearchBar className="max-w-none" />
      </div>

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {portfolioItems.map((item) => (
          <ProductCard
            key={item.title}
            title={item.title}
            description={item.description}
            price={item.price}
            imageClassName={item.imageClassName}
          />
        ))}
      </div>
    </section>
  );
}
