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
            {editing ? "บันทึกการแก้ไข" : "บันทึก"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <label className="block">
          <span className="mb-1 block text-slate-600">ประเภทสินค้า (จากจัดการประเภทสินค้า)</span>
          <select
            value={form.categoryId}
            onChange={(e) =>
              onFormChange({
                ...form,
                categoryId: e.target.value,
                selectedThickness: "",
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          >
            {doorCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">ความหนา</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onFormChange({ ...form, mode: "existing", newThickness: "" })}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                form.mode === "existing"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              ใช้ความหนาที่มี
            </button>
            <button
              type="button"
              onClick={() => onFormChange({ ...form, mode: "new", selectedThickness: "" })}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                form.mode === "new"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              เพิ่มความหนาใหม่
            </button>
          </div>
        </label>

        {form.mode === "existing" ? (
          <label className="block">
            <span className="mb-1 block text-slate-600">เลือกความหนา</span>
            <select
              value={form.selectedThickness}
              onChange={(e) => onFormChange({ ...form, selectedThickness: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
            >
              <option value="">เลือกความหนา</option>
              {existingThicknesses.map((thickness) => (
                <option key={thickness} value={thickness}>
                  {thickness}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="block">
            <span className="mb-1 block text-slate-600">ความหนาใหม่</span>
            <input
              value={form.newThickness}
              onChange={(e) => onFormChange({ ...form, newThickness: e.target.value })}
              placeholder="เช่น 0.8-0.9 mm (เบอร์ 21)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-slate-600">พื้นที่สูงสุด (ตร.ม.)</span>
            <input
              type="number"
              min={0}
              value={form.maxArea}
              onChange={(e) => onFormChange({ ...form, maxArea: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-slate-600">ราคา / ตร.ม.</span>
          <div className="flex rounded-lg border border-slate-200">
            <input
              type="number"
              min={0}
              value={form.pricePerSqm}
              onChange={(e) => onFormChange({ ...form, pricePerSqm: e.target.value })}
              className="w-full rounded-l-lg px-3 py-2 outline-none"
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
