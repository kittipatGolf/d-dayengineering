type ProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageClassName?: string;
  detailsTitle?: string;
  features?: string[];
};

export function ProductCard({
  title,
  description,
  price,
  imageClassName,
  detailsTitle,
  features,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 ${imageClassName ?? ""}`}
        aria-label={title}
      />

      <h3 className="mt-4 text-[24px] font-bold leading-tight text-slate-700">
        {title}
      </h3>
      <p className="mt-2 text-[16px] text-slate-600">{description}</p>
      {features && features.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p className="text-[20px] font-bold text-blue-700">
            {detailsTitle ?? title}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] text-slate-700">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mt-3 text-[16px] font-extrabold text-red-600">{price}</p>
    </article>
  );
}
