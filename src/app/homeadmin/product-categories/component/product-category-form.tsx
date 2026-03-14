import {
  CheckCircleIcon,
  PaintBrushIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { CategoryKind } from "./types";

type ProductCategoryFormProps = {
  open: boolean;
  editing: boolean;
  name: string;
  kind: CategoryKind;
  isActive: boolean;
  selectedColors: string[];
  customColor: string;
  defaultColors: string[];
  onClose: () => void;
  onNameChange: (name: string) => void;
  onKindChange: (kind: CategoryKind) => void;
  onStatusChange: (next: boolean) => void;
  onToggleColor: (color: string) => void;
  onCustomColorChange: (color: string) => void;
  onAddCustomColor: () => void;
  onSubmit: () => void;
};

export function ProductCategoryForm({
  open,
  editing,
  name,
  kind,
  isActive,
  selectedColors,
  customColor,
  defaultColors,
  onClose,
  onNameChange,
  onKindChange,
  onStatusChange,
  onToggleColor,
  onCustomColorChange,
  onAddCustomColor,
  onSubmit,
}: ProductCategoryFormProps) {
  return (
    <FormModal
      open={open}
      title={editing ? "แก้ไขประเภทสินค้า" : "เพิ่มประเภทสินค้า"}
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
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            <CheckCircleIcon className="h-5 w-5" />
            {editing ? "บันทึกการแก้ไข" : "เพิ่มทันที"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <label className="block">
          <span className="mb-1 block text-slate-600">ชื่อประเภท</span>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="เช่น ประตูม้วนอลูซิงค์"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">กลุ่มสินค้า</span>
          <select
            value={kind}
            onChange={(e) => onKindChange(e.target.value as CategoryKind)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
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
                <PlusIcon className="h-3.5 w-3.5" />
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

        <div className="flex items-center gap-3">
          <span className="text-slate-600">สถานะประเภท</span>
          <button
            type="button"
            onClick={() => onStatusChange(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              isActive ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-slate-500">{isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}</span>
        </div>
      </div>
    </FormModal>
  );
}
