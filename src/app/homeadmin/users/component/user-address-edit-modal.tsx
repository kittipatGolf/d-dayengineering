import { FormModal } from "../../components/admin-shared/form-modal";

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

const PROVINCE_OPTIONS = ["กรุงเทพมหานคร", "เชียงใหม่", "สงขลา", "นครปฐม"] as const;
const DISTRICT_OPTIONS = ["เขตพระนคร", "หาดใหญ่", "แม่ริม", "เมืองนครปฐม"] as const;
const SUBDISTRICT_OPTIONS = ["พระบรมมหาราชวัง", "หาดใหญ่", "ริมใต้", "สนามจันทร์"] as const;

function selectValueWithFallback(current: string, options: readonly string[]) {
  if (!current) return "";
  return options.includes(current) ? current : "";
}

export function UserAddressEditModal({
  open,
  form,
  onClose,
  onFormChange,
  onSubmit,
}: UserAddressEditModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="แก้ไขที่อยู่"
      maxWidthClassName="max-w-4xl"
      footer={
        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-base font-semibold text-white hover:bg-blue-700"
        >
          บันทึก
        </button>
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

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">จังหวัด</span>
          <select
            value={selectValueWithFallback(form.province, PROVINCE_OPTIONS)}
            onChange={(event) => onFormChange({ ...form, province: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="">เลือกจังหวัด</option>
            {PROVINCE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">เขต/อำเภอ</span>
          <select
            value={selectValueWithFallback(form.district, DISTRICT_OPTIONS)}
            onChange={(event) => onFormChange({ ...form, district: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="">เลือกเขต</option>
            {DISTRICT_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">ตำบล</span>
          <select
            value={selectValueWithFallback(form.subdistrict, SUBDISTRICT_OPTIONS)}
            onChange={(event) => onFormChange({ ...form, subdistrict: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="">เลือกตำบล</option>
            {SUBDISTRICT_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">รหัสไปรษณีย์</span>
          <input
            value={form.postalCode}
            onChange={(event) => onFormChange({ ...form, postalCode: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>
      </div>
    </FormModal>
  );
}

