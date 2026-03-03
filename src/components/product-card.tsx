type ProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageClassName?: string;
};

export function ProductCard({
  title,
  description,
  price,
  imageClassName,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`mx-auto h-[250px] w-[250px] rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 ${imageClassName ?? ""}`}
        aria-label={title}
      />

      <h3 className="mt-4 text-[24px] font-bold leading-tight text-slate-700">
        {title}
      </h3>
      <p className="mt-2 text-[16px] text-slate-600">{description}</p>
      <p className="mt-3 text-[16px] font-extrabold text-red-600">{price}</p>
    </article>
  );
}
