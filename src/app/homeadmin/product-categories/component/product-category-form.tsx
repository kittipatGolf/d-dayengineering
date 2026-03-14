import {
  CheckCircleIcon,
  PaintBrushIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { CategoryKind } from "./types";

type ProductCategoryFormProps = {
  name: string;
  kind: CategoryKind;
  selectedColors: string[];
  customColor: string;
  defaultColors: string[];
  onNameChange: (name: string) => void;
  onKindChange: (kind: CategoryKind) => void;
  onToggleColor: (color: string) => void;
  onCustomColorChange: (color: string) => void;
  onAddCustomColor: () => void;
};

export function ProductCategoryForm({
  name,
  kind,
  selectedColors,
  customColor,
  defaultColors,
  onNameChange,
  onKindChange,
  onToggleColor,
  onCustomColorChange,
  onAddCustomColor,
}: ProductCategoryFormProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <PlusIcon className="h-5 w-5 text-blue-700" />
        <h2 className="text-base font-semibold text-slate-900">เพิ่มประเภทสินค้า</h2>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <label className="block">
          <span className="mb-1 block text-slate-600">ชื่อประเภท</span>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="เช่น ประตูม้วนอลูซิงค์"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">กลุ่มสินค้า</span>
          <select
            value={kind}
            onChange={(e) => onKindChange(e.target.value as CategoryKind)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          >
            <option value="ประตูม้วน">ประตูม้วน</option>
            <option value="อะไหล่">อะไหล่</option>
          </select>
        </label>

        {kind === "ประตูม้วน" && (
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <PaintBrushIcon className="h-4 w-4 text-slate-600" />
              <p className="font-medium text-slate-700">สีที่รองรับ</p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {defaultColors.map((color) => {
                const active = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onToggleColor(color)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
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

            <div className="mt-3 flex gap-2">
              <input
                value={customColor}
                onChange={(e) => onCustomColorChange(e.target.value)}
                placeholder="เพิ่มสีเอง"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none ring-blue-200 transition focus:ring"
              />
              <button
                type="button"
                onClick={onAddCustomColor}
                className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-white transition hover:bg-slate-700"
              >
                เพิ่ม
              </button>
            </div>

            {selectedColors.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                  >
                    {color}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
        >
          <CheckCircleIcon className="h-5 w-5" />
          บันทึกประเภทสินค้า
        </button>
        <p className="text-xs text-slate-500">
          เมื่อเลือกกลุ่มประตูม้วน ควรกำหนดสีอย่างน้อย 1 สี เพื่อให้หน้าออเดอร์เลือกสีต่อได้
        </p>
      </div>
    </div>
  );
}
