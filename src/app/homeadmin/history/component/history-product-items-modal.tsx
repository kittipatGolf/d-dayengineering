import Image from "next/image";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { ProductHistoryLineItem } from "./types";

type HistoryProductItemsModalProps = {
  open: boolean;
  items: ProductHistoryLineItem[];
  onClose: () => void;
};

export function HistoryProductItemsModal({ open, items, onClose }: HistoryProductItemsModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="รายการสินค้า"
      maxWidthClassName="max-w-6xl"
      footer={<div />}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-3 font-semibold">ชื่อสินค้า</th>
              <th className="px-3 py-3 font-semibold">รูปสินค้า</th>
              <th className="px-3 py-3 font-semibold">สี</th>
              <th className="px-3 py-3 font-semibold">กว้าง (ม.)</th>
              <th className="px-3 py-3 font-semibold">ยาว (ม.)</th>
              <th className="px-3 py-3 font-semibold">ความหนา</th>
              <th className="px-3 py-3 font-semibold">ตัวเลือกติดตั้ง</th>
              <th className="px-3 py-3 font-semibold">จำนวน</th>
              <th className="px-3 py-3 font-semibold">ราคา/ต่อชิ้น</th>
              <th className="px-3 py-3 font-semibold">การรับประกัน</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="px-3 py-4 font-medium text-slate-800">{item.name}</td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {item.images.map((image, index) => (
                      <Image
                        key={`${item.id}-${index}`}
                        src={image}
                        alt={item.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-md border border-slate-200 object-cover"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 text-slate-700">{item.color}</td>
                <td className="px-3 py-4 text-slate-700">{item.widthM || "-"}</td>
                <td className="px-3 py-4 text-slate-700">{item.lengthM || "-"}</td>
                <td className="px-3 py-4 text-slate-700">{item.thickness}</td>
                <td className="px-3 py-4 text-slate-700">{item.installOption}</td>
                <td className="px-3 py-4 text-slate-700">{item.quantity}</td>
                <td className="px-3 py-4 text-slate-700">
                  {new Intl.NumberFormat("th-TH").format(item.pricePerUnit)} บาท
                </td>
                <td className="px-3 py-4 text-slate-700">{item.warranty}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-slate-500">
                  ไม่มีรายการสินค้า
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </FormModal>
  );
}
