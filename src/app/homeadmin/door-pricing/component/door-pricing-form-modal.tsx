import { SearchableSelect } from "@/components/searchable-select";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { ProductCategory } from "../../product-categories/component/types";
import type { DoorPricingFormState } from "./types";

type DoorPricingFormModalProps = {
  open: boolean;
  editing: boolean;
  form: DoorPricingFormState;
  doorCategories: ProductCategory[];
  existingThicknesses: string[];
  onClose: () => void;
  onFormChange: (next: DoorPricingFormState) => void;
  onSubmit: () => void;
};

export function DoorPricingFormModal({
  open,
  editing,
  form,
  doorCategories,
  existingThicknesses,
  onClose,
  onFormChange,
  onSubmit,
}: DoorPricingFormModalProps) {
  return (
    <FormModal
      open={open}
      title={editing ? "แก้ไขช่วงราคา" : "เพิ่มช่วงราคาใหม่"}
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
      footer={
        <div className="flex items-center justify-end gap-3">
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
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            {editing ? "บันทึกการแก้ไข" : "บันทึก"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        <div>
          <span className="mb-1 block text-slate-600">ประเภทสินค้า (จากจัดการประเภทสินค้า)</span>
          <SearchableSelect
            options={doorCategories.map((item) => ({ value: item.id, label: item.name }))}
            value={form.categoryId}
            onChange={(v) =>
              onFormChange({
                ...form,
                categoryId: v,
                selectedThickness: "",
              })
            }
            size="sm"
          />
        </div>

        <label className="block">
          <span className="mb-1 block text-slate-600">ความหนา</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onFormChange({ ...form, mode: "existing", newThickness: "" })}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                form.mode === "existing"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ใช้ความหนาที่มี
            </button>
            <button
              type="button"
              onClick={() => onFormChange({ ...form, mode: "new", selectedThickness: "" })}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                form.mode === "new"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              เพิ่มความหนาใหม่
            </button>
          </div>
        </label>

        {form.mode === "existing" ? (
          <div>
            <span className="mb-1 block text-slate-600">เลือกความหนา</span>
            <SearchableSelect
              placeholder="เลือกความหนา"
              options={existingThicknesses}
              value={form.selectedThickness}
              onChange={(v) => onFormChange({ ...form, selectedThickness: v })}
              size="sm"
            />
          </div>
        ) : (
          <label className="block">
            <span className="mb-1 block text-slate-600">ความหนาใหม่</span>
            <input
              value={form.newThickness}
              onChange={(e) => onFormChange({ ...form, newThickness: e.target.value })}
              placeholder="เช่น 0.8-0.9 mm (เบอร์ 21)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-slate-600">พื้นที่ต่ำสุด (ตร.ม.)</span>
            <input
              type="number"
              min={0}
              value={form.minArea}
              onChange={(e) => onFormChange({ ...form, minArea: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-slate-600">พื้นที่สูงสุด (ตร.ม.)</span>
            <input
              type="number"
              min={0}
              value={form.maxArea}
              onChange={(e) => onFormChange({ ...form, maxArea: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-slate-600">ราคา / ตร.ม.</span>
          <div className="flex overflow-hidden rounded-xl border border-slate-200">
            <input
              type="number"
              min={0}
              value={form.pricePerSqm}
              onChange={(e) => onFormChange({ ...form, pricePerSqm: e.target.value })}
              className="w-full bg-slate-50 px-3 py-2.5 outline-none transition focus:bg-white"
            />
            <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-slate-500">
              บาท
            </span>
          </div>
        </label>
      </div>
    </FormModal>
  );
}
