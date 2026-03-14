import { useRef } from "react";
import { ArrowPathIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { ProductCategory } from "../../product-categories/component/types";
import type { ProductFormState } from "./types";

type ProductFormProps = {
  editing: boolean;
  form: ProductFormState;
  categoryOptions: ProductCategory[];
  availableColors: string[];
  onReset: () => void;
  onPickImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onFormChange: (next: ProductFormState) => void;
  onSubmit: () => void;
};

export function ProductForm({
  editing,
  form,
  categoryOptions,
  availableColors,
  onReset,
  onPickImages,
  onRemoveImage,
  onFormChange,
  onSubmit,
}: ProductFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
        {editing && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <ArrowPathIcon className="h-4 w-4" />
            เริ่มเพิ่มใหม่
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="mb-1 text-slate-600">รูปภาพสินค้า (หลายรูป)</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              onPickImages(e.target.files);
              e.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50"
          >
            <PlusIcon className="h-4 w-4" />
            เพิ่มรูปภาพ
          </button>

          {form.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.images.map((img, index) => (
                <div key={`${img}-${index}`} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`preview-${index}`} className="h-14 w-14 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -right-1 -top-1 rounded-full bg-slate-900 p-0.5 text-white"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1 block text-slate-600">ชื่อสินค้า</span>
          <input
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="เช่น ประตูม้วนอลูซิงค์ รุ่น A"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">หมวดหมู่</span>
          <select
            value={form.categoryId}
            onChange={(e) => {
              const nextCategory = categoryOptions.find((item) => item.id === e.target.value);
              onFormChange({
                ...form,
                categoryId: e.target.value,
                color: nextCategory?.kind === "ประตูม้วน" ? form.color : "",
              });
            }}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          >
            {categoryOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.kind === "อะไหล่" ? "อะไหล่ประตูม้วน" : item.kind})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">ราคา (บาท)</span>
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => onFormChange({ ...form, price: e.target.value })}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">สี</span>
          {availableColors.length > 0 ? (
            <select
              value={form.color}
              onChange={(e) => onFormChange({ ...form, color: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
            >
              <option value="">เลือกสี</option>
              {availableColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-slate-500">อะไหล่ไม่ต้องระบุสี</div>
          )}
        </label>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
        >
          {editing ? "บันทึกการแก้ไขสินค้า" : "เพิ่มสินค้า"}
        </button>
      </div>
    </div>
  );
}
