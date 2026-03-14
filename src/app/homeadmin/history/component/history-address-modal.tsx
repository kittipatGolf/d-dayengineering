import { FormModal } from "../../components/admin-shared/form-modal";
import type { HistoryAddress } from "./types";

type HistoryAddressModalProps = {
  open: boolean;
  title: string;
  address: HistoryAddress | null;
  onClose: () => void;
};

export function HistoryAddressModal({ open, title, address, onClose }: HistoryAddressModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      maxWidthClassName="max-w-5xl"
      footer={<div />}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-3 font-semibold">ที่อยู่</th>
              <th className="px-3 py-3 font-semibold">ตำบล/แขวง</th>
              <th className="px-3 py-3 font-semibold">อำเภอ/เขต</th>
              <th className="px-3 py-3 font-semibold">จังหวัด</th>
              <th className="px-3 py-3 font-semibold">รหัสไปรษณีย์</th>
            </tr>
          </thead>
          <tbody>
            {address ? (
              <tr className="border-b border-slate-100">
                <td className="px-3 py-4 text-slate-700">{address.line}</td>
                <td className="px-3 py-4 text-slate-700">{address.subdistrict}</td>
                <td className="px-3 py-4 text-slate-700">{address.district}</td>
                <td className="px-3 py-4 text-slate-700">{address.province}</td>
                <td className="px-3 py-4 text-slate-700">{address.postalCode}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                  ไม่พบข้อมูลที่อยู่
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </FormModal>
  );
}

