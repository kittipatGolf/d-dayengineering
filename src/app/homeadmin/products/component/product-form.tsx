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
      title={editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            {editing ? "บันทึกการแก้ไข" : "เพิ่มทันที"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <MultiImageUploader
          value={form.images}
          onChange={(images) => onFormChange({ ...form, images })}
        />

        <label className="block">
          <span className="mb-1 block text-slate-600">ชื่อสินค้า</span>
          <input
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <div>
          <span className="mb-1 block text-slate-600">ประเภทสินค้า</span>
          <SearchableSelect
            options={[
              { value: "ประตูม้วน", label: "ประตูม้วน" },
              { value: "อะไหล่", label: "อะไหล่ประตูม้วน" },
            ]}
            value={form.productType}
            onChange={(v) => onProductTypeChange(v as CategoryKind)}
            searchable={false}
            size="sm"
          />
        </div>

        <div>
          <span className="mb-1 block text-slate-600">หมวดหมู่สินค้า</span>
          {categoryOptions.length === 0 ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
              ยังไม่มีหมวดหมู่ในกลุ่มนี้ กรุณาเพิ่มหมวดหมู่สินค้าก่อน
            </p>
          ) : (
            <SearchableSelect
              options={categoryOptions.map((item) => ({ value: item.id, label: item.name }))}
              value={form.categoryId}
              onChange={onCategoryChange}
              size="sm"
            />
          )}
        </div>

        {form.productType === "ประตูม้วน" ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-blue-800">
            ราคา: ราคาตามขนาด
          </div>
        ) : (
          <label className="block">
            <span className="mb-1 block text-slate-600">ราคา</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => onFormChange({ ...form, price: e.target.value })}
                className="w-full bg-slate-50 px-3 py-2.5 outline-none transition focus:bg-white"
              />
              <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-slate-500">
                บาท / ชุด
              </span>
            </div>
          </label>
        )}

        {form.productType === "ประตูม้วน" && (
          <div className="block">
            <span className="mb-2 block text-slate-600">สี (เลือกได้หลายสี)</span>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const active = form.colors.includes(color);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      const nextColors = active
                        ? form.colors.filter((item) => item !== color)
                        : [...form.colors, color];
                      onFormChange({ ...form, colors: nextColors });
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
            {form.colors.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">เลือกแล้ว: {form.colors.join(", ")}</p>
            )}
          </div>
        )}

        <label className="block">
          <span className="mb-1 block text-slate-600">คำอธิบาย</span>
          <textarea
            value={form.description}
            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">การรับประกัน (ปี)</span>
          <input
            value={form.warrantyYears}
            onChange={(e) => onFormChange({ ...form, warrantyYears: e.target.value })}
            placeholder="ระบุจำนวนปี"
            className="w-56 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <div className="flex items-center gap-3">
          <span className="text-slate-600">สถานะสินค้า</span>
          <button
            type="button"
            onClick={() => onFormChange({ ...form, isSelling: !form.isSelling })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              form.isSelling ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                form.isSelling ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-slate-500">{form.isSelling ? "กำลังวางขาย" : "ปิดการขาย"}</span>
        </div>
      </div>
    </FormModal>
  );
}
