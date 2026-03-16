import { FormModal } from "../../components/admin-shared/form-modal";
import { ThaiAddressInput, type ThaiAddressValue } from "@/components/thai-address-input";

export type AddressEditState = {
  line: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
};

type UserAddressEditModalProps = {
  open: boolean;
  form: AddressEditState;
  onClose: () => void;
  onFormChange: (next: AddressEditState) => void;
  onSubmit: () => void;
};

export function UserAddressEditModal({
  open,
  form,
  onClose,
  onFormChange,
  onSubmit,
}: UserAddressEditModalProps) {
  const addrValue: ThaiAddressValue = {
    province: form.province,
    district: form.district,
    subdistrict: form.subdistrict,
    postalCode: form.postalCode,
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="แก้ไขที่อยู่"
      maxWidthClassName="max-w-4xl"
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
            บันทึก
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">ที่อยู่</span>
          <input
            value={form.line}
            onChange={(event) => onFormChange({ ...form, line: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>

        <ThaiAddressInput
          value={addrValue}
          onChange={(v) => onFormChange({ ...form, ...v })}
          inputClassName="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          labelClassName="mb-1 block text-sm font-medium text-slate-700"
        />
      </div>
    </FormModal>
  );
}
