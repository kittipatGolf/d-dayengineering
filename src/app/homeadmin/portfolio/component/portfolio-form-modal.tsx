import { MultiImageUploader } from "@/components/shared-image/multi-image-uploader";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { PortfolioFormState } from "./types";

type PortfolioFormModalProps = {
  open: boolean;
  editing: boolean;
  form: PortfolioFormState;
  onClose: () => void;
  onFormChange: (next: PortfolioFormState) => void;
  onSubmit: () => void;
};

export function PortfolioFormModal({
  open,
  editing,
  form,
  onClose,
  onFormChange,
  onSubmit,
}: PortfolioFormModalProps) {
  return (
    <FormModal
      open={open}
      title={editing ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}
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
            {editing ? "บันทึก" : "เพิ่มทันที"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <label className="block">
          <span className="mb-1 block text-slate-600">ชื่อผลงาน</span>
          <input
            value={form.title}
            onChange={(e) => onFormChange({ ...form, title: e.target.value })}
            placeholder="ระบุชื่อผลงาน"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-slate-600">คำอธิบายผลงาน</span>
          <input
            value={form.description}
            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
            placeholder="ระบุคำอธิบายผลงาน"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-blue-200 transition focus:ring"
          />
        </label>

        <MultiImageUploader
          value={form.images}
          onChange={(images) => onFormChange({ ...form, images })}
        />
      </div>
    </FormModal>
  );
}
