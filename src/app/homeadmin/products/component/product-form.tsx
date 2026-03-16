import {
  CheckIcon,
  CubeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SwatchIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { MultiImageUploader } from "@/components/shared-image/multi-image-uploader";
import { SearchableSelect } from "@/components/searchable-select";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { CategoryKind, ProductCategory } from "../../product-categories/component/types";
import type { ProductFormState } from "./types";

type ProductFormModalProps = {
  open: boolean;
  editing: boolean;
  form: ProductFormState;
  categoryOptions: ProductCategory[];
  availableColors: string[];
  onClose: () => void;
  onProductTypeChange: (type: CategoryKind) => void;
  onCategoryChange: (categoryId: string) => void;
  onFormChange: (next: ProductFormState) => void;
  onSubmit: () => void;
};

const colorMap: Record<string, string> = {
  ขาว: "#ffffff",
  ครีม: "#f5f0da",
  เทาเข้ม: "#4b5563",
  ดำ: "#111827",
  น้ำเงิน: "#1d4ed8",
  แดง: "#ef4444",
  เขียว: "#16a34a",
  เงิน: "#9ca3af",
};

function resolveColor(color: string) {
  const t = color.trim();
  if (t.startsWith("#") || t.startsWith("rgb") || t.startsWith("hsl")) return t;
  return colorMap[t] ?? "#94a3b8";
}

function SectionHeading({ icon: Icon, children }: { icon: typeof CubeIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <Icon className="h-4 w-4 text-blue-500" />
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

export function ProductFormModal({
  open,
  editing,
  form,
  categoryOptions,
  availableColors,
  onClose,
  onProductTypeChange,
  onCategoryChange,
  onFormChange,
  onSubmit,
}: ProductFormModalProps) {
  return (
    <FormModal
      open={open}
      title={editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
      onClose={onClose}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <CheckIcon className="h-4 w-4" />
            {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {/* ── Section: Images ── */}
        <div className="space-y-3">
          <SectionHeading icon={SparklesIcon}>รูปภาพสินค้า</SectionHeading>
          <MultiImageUploader
            value={form.images}
            onChange={(images) => onFormChange({ ...form, images })}
          />
        </div>

        <hr className="border-slate-100" />

        {/* ── Section: Basic Info ── */}
        <div className="space-y-4">
          <SectionHeading icon={CubeIcon}>ข้อมูลพื้นฐาน</SectionHeading>

          <label className="block">
            <span className="mb-1.5 block font-medium text-slate-600">ชื่อสินค้า</span>
            <input
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="กรอกชื่อสินค้า"
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block font-medium text-slate-600">ประเภทสินค้า</span>
              <SearchableSelect
                options={[
                  { value: "ประตูม้วน", label: "ประตูม้วน" },
                  { value: "อะไหล่", label: "อะไหล่ประตูม้วน" },
                ]}
                value={form.productType}
                onChange={(v) => onProductTypeChange(v as CategoryKind)}
                searchable={false}
              />
            </div>

            <div>
              <span className="mb-1.5 block font-medium text-slate-600">หมวดหมู่</span>
              {categoryOptions.length === 0 ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-700">
                  ยังไม่มีหมวดหมู่ในกลุ่มนี้
                </p>
              ) : (
                <SearchableSelect
                  options={categoryOptions.map((item) => ({ value: item.id, label: item.name }))}
                  value={form.categoryId}
                  onChange={onCategoryChange}
                />
              )}
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* ── Section: Pricing ── */}
        <div className="space-y-4">
          <SectionHeading icon={TagIcon}>ราคาสินค้า</SectionHeading>

          {form.productType === "ประตูม้วน" ? (
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <TagIcon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-blue-800">ราคาคำนวณตามขนาดพื้นที่ (ตร.ม.)</span>
            </div>
          ) : (
            <label className="block">
              <span className="mb-1.5 block font-medium text-slate-600">ราคา</span>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => onFormChange({ ...form, price: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-50 px-3 py-2.5 outline-none transition focus:bg-white"
                />
                <span className="flex items-center border-l border-slate-200 bg-slate-50 px-4 text-slate-500">
                  บาท / ชุด
                </span>
              </div>
            </label>
          )}
        </div>

        {/* ── Section: Colors (door only) ── */}
        {form.productType === "ประตูม้วน" && (
          <>
            <hr className="border-slate-100" />
            <div className="space-y-3">
              <SectionHeading icon={SwatchIcon}>สีที่มี (เลือกได้หลายสี)</SectionHeading>

              {availableColors.length === 0 ? (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400">
                  ไม่มีสีให้เลือกในหมวดหมู่นี้
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const active = form.colors.includes(color);
                    const colorValue = resolveColor(color);
                    const isLight = ["#ffffff", "#f5f0da"].includes(colorValue);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          const nextColors = active
                            ? form.colors.filter((c) => c !== color)
                            : [...form.colors, color];
                          onFormChange({ ...form, colors: nextColors });
                        }}
                        className={`inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full ${isLight ? "ring-1 ring-slate-300" : ""}`}
                          style={{ backgroundColor: colorValue }}
                        />
                        {color}
                        {active && <CheckIcon className="h-3.5 w-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {form.colors.length > 0 && (
                <p className="text-xs text-slate-500">
                  เลือกแล้ว {form.colors.length} สี: {form.colors.join(", ")}
                </p>
              )}
            </div>
          </>
        )}

        <hr className="border-slate-100" />

        {/* ── Section: Details ── */}
        <div className="space-y-4">
          <SectionHeading icon={DocumentTextIcon}>รายละเอียดเพิ่มเติม</SectionHeading>

          <label className="block">
            <span className="mb-1.5 block font-medium text-slate-600">คำอธิบาย</span>
            <textarea
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              rows={3}
              placeholder="อธิบายรายละเอียดสินค้า..."
              className={`${inputClass} resize-none`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-medium text-slate-600">การรับประกัน</span>
              <div className="relative">
                <ShieldCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.warrantyYears}
                  onChange={(e) => onFormChange({ ...form, warrantyYears: e.target.value })}
                  placeholder="ระบุจำนวนปี"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </label>

            <div>
              <span className="mb-1.5 block font-medium text-slate-600">สถานะสินค้า</span>
              <div className="flex h-10.5 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <button
                  type="button"
                  aria-label="สลับสถานะสินค้า"
                  onClick={() => onFormChange({ ...form, isSelling: !form.isSelling })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    form.isSelling ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                      form.isSelling ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${form.isSelling ? "text-emerald-700" : "text-slate-500"}`}>
                  {form.isSelling ? "กำลังวางขาย" : "ปิดการขาย"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
