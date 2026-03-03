import { ProductCard } from "@/components/product-card";

const products = [
  {
    title: "ประตูม้วนไฟฟ้า",
    description: "ราคาขึ้นอยู่กับขนาด",
    price: "เริ่มต้น 9,900 บาท",
    imageClassName: "from-zinc-500 via-zinc-700 to-zinc-900",
  },
  {
    title: "ประตูม้วนมือดึง",
    description: "ราคาขึ้นอยู่กับขนาด",
    price: "เริ่มต้น 4,900 บาท",
    imageClassName: "from-neutral-500 via-neutral-700 to-slate-900",
  },
  {
    title: "ประตูม้วนรอกโซ่",
    description: "ราคาขึ้นอยู่กับขนาด",
    price: "เริ่มต้น 6,900 บาท",
    imageClassName: "from-gray-400 via-slate-600 to-gray-800",
  },
  {
    title: "เสากลางประตูม้วน",
    description: "อะไหล่ประตูม้วน",
    price: "500 บาท",
    imageClassName: "from-slate-200 via-zinc-300 to-slate-400",
  },
];

export function StoreProductsSection() {
  return (
    <section className="w-full">
      <h2 className="mb-4 text-4xl font-bold text-slate-900">สินค้าภายในร้าน</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.title}
            title={product.title}
            description={product.description}
            price={product.price}
            imageClassName={product.imageClassName}
          />
        ))}
      </div>
    </section>
  );
}
