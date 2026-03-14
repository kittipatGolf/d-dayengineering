import { FormModal } from "../../components/admin-shared/form-modal";
import type { AdminUser, UserAddress } from "./types";

type UserAddressesModalProps = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onEditAddress: (address: UserAddress) => void;
  onDeleteAddress: (addressId: string) => void;
};

export function UserAddressesModal({
  open,
  user,
  onClose,
  onEditAddress,
  onDeleteAddress,
}: UserAddressesModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={user ? `ที่อยู่ของ ${user.firstName} ${user.lastName}` : "ที่อยู่"}
      maxWidthClassName="max-w-6xl"
      footer={<div />}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-3 font-semibold">ที่อยู่</th>
              <th className="px-3 py-3 font-semibold">จังหวัด</th>
              <th className="px-3 py-3 font-semibold">เขต/อำเภอ</th>
              <th className="px-3 py-3 font-semibold">ตำบล</th>
              <th className="px-3 py-3 font-semibold">รหัสไปรษณีย์</th>
              <th className="px-3 py-3 font-semibold">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {(user?.addresses ?? []).map((address) => (
              <tr key={address.id} className="border-b border-slate-100">
                <td className="px-3 py-4 text-slate-700">{address.line}</td>
                <td className="px-3 py-4 text-slate-700">{address.province}</td>
                <td className="px-3 py-4 text-slate-700">{address.district}</td>
                <td className="px-3 py-4 text-slate-700">{address.subdistrict}</td>
                <td className="px-3 py-4 text-slate-700">{address.postalCode}</td>
                <td className="px-3 py-4">
                  <div className="inline-flex items-center gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => onEditAddress(address)}
                      className="text-blue-600 hover:underline"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(address.id)}
                      className="text-rose-600 hover:underline"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(user?.addresses.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                  ยังไม่มีข้อมูลที่อยู่
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </FormModal>
  );
}

