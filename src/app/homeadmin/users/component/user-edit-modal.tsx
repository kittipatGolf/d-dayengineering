import { SearchableSelect } from "@/components/searchable-select";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { UserRole } from "./types";

type UserEditState = {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: UserRole;
};

type UserEditModalProps = {
  open: boolean;
  form: UserEditState;
  onClose: () => void;
  onFormChange: (next: UserEditState) => void;
  onSubmit: () => void;
};

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

export function UserEditModal({ open, form, onClose, onFormChange, onSubmit }: UserEditModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="แก้ไขข้อมูลผู้ใช้"
      maxWidthClassName="max-w-md"
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
          <span className="mb-1 block text-sm text-slate-700">ชื่อผู้ใช้</span>
          <input
            value={form.username}
            onChange={(event) => onFormChange({ ...form, username: event.target.value })}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">ชื่อจริง</span>
          <input
            value={form.firstName}
            onChange={(event) => onFormChange({ ...form, firstName: event.target.value })}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">นามสกุล</span>
          <input
            value={form.lastName}
            onChange={(event) => onFormChange({ ...form, lastName: event.target.value })}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">เบอร์โทรศัพท์</span>
          <input
            value={form.phone}
            onChange={(event) => onFormChange({ ...form, phone: event.target.value })}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">อีเมล</span>
          <input
            value={form.email}
            onChange={(event) => onFormChange({ ...form, email: event.target.value })}
            className={inputClass}
          />
        </label>

        <div>
          <span className="mb-1 block text-sm text-slate-700">บทบาท</span>
          <SearchableSelect
            options={[
              { value: "User", label: "User" },
              { value: "Admin", label: "Admin" },
            ]}
            value={form.role}
            onChange={(v) => onFormChange({ ...form, role: v as UserRole })}
            searchable={false}
            size="sm"
          />
        </div>
      </div>
    </FormModal>
  );
}
