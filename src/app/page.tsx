import { SlideShow } from "@/components/slideshow";
import { ServicesSection } from "@/components/services-section";
import { StoreProductsSection } from "@/components/store-products-section";

export default function Home() {
  return (
    <div className="space-y-12">
      <SlideShow />
      <ServicesSection />
      <StoreProductsSection />
    </div>
  );
}
