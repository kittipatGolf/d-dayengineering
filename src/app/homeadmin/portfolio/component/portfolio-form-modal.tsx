import { useRef } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { PortfolioFormState } from "./types";

type PortfolioFormModalProps = {
  open: boolean;
  editing: boolean;
  form: PortfolioFormState;
  onClose: () => void;
  onFormChange: (next: PortfolioFormState) => void;
  onPickImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: () => void;
};

export function PortfolioFormModal({
  open,
  editing,
  form,
  onClose,
  onFormChange,
  onPickImages,
  onRemoveImage,
  onSubmit,
}: PortfolioFormModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

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

        <div className="rounded-xl border border-slate-200">
          <div className="border-b border-slate-200 p-3">
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
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              เลือกรูปภาพ
            </button>
          </div>

          <div className="p-3">
            {form.images.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, index) => (
                  <div key={`${img}-${index}`} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`portfolio-preview-${index}`} className="h-16 w-16 rounded-lg object-cover" />
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
            ) : (
              <p className="text-slate-400">ยังไม่ได้เลือกรูปภาพ</p>
            )}
          </div>
        </div>
      </div>
    </FormModal>
  );
}
