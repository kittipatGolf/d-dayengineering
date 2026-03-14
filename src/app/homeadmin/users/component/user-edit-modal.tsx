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

export function UserEditModal({ open, form, onClose, onFormChange, onSubmit }: UserEditModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="แก้ไขข้อมูลผู้ใช้"
      maxWidthClassName="max-w-md"
      footer={
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">ชื่อจริง</span>
          <input
            value={form.firstName}
            onChange={(event) => onFormChange({ ...form, firstName: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">นามสกุล</span>
          <input
            value={form.lastName}
            onChange={(event) => onFormChange({ ...form, lastName: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">เบอร์โทรศัพท์</span>
          <input
            value={form.phone}
            onChange={(event) => onFormChange({ ...form, phone: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">อีเมล</span>
          <input
            value={form.email}
            onChange={(event) => onFormChange({ ...form, email: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">บทบาท</span>
          <select
            value={form.role}
            onChange={(event) => onFormChange({ ...form, role: event.target.value as UserRole })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
      </div>
    </FormModal>
  );
}

