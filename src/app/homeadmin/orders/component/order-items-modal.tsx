import Image from "next/image";
import { useEffect, useState } from "react";
import { FormModal } from "../../components/admin-shared/form-modal";
import { FilterTabs } from "../../components/admin-shared/filter-tabs";
import type { OrderItem } from "./types";

type OrderItemsModalProps = {
  open: boolean;
  items: OrderItem[];
  getColorOptions: (item: OrderItem) => string[];
  onClose: () => void;
  onSave: (items: OrderItem[]) => void;
};

type ItemsTab = "รายละเอียดสินค้า" | "แก้ไขรายการ";

export function OrderItemsModal({ open, items, getColorOptions, onClose, onSave }: OrderItemsModalProps) {
  const [tab, setTab] = useState<ItemsTab>("รายละเอียดสินค้า");
  const [editingItems, setEditingItems] = useState<OrderItem[]>(items);

  // Sync editingItems when modal opens with new items
  useEffect(() => {
    setEditingItems(items);
    setTab("รายละเอียดสินค้า");
  }, [items]);

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="รายการสินค้า"
      maxWidthClassName="max-w-screen-xl"
      footer={
        tab === "แก้ไขรายการ" ? (
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => onSave(editingItems)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        ) : (
          <div />
        )
      }
    >
      <FilterTabs
        options={["รายละเอียดสินค้า", "แก้ไขรายการ"] as const}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-4 overflow-x-auto">
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
            {editingItems.map((item) => (
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
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <select
                      value={item.color}
                      onChange={(event) => {
                        const color = event.target.value;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, color } : row)),
                        );
                      }}
                      className="w-28 rounded-md border border-slate-300 px-2 py-1"
                    >
                      {getColorOptions(item).map((color) => (
                        <option key={`${item.id}-${color}`} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.color
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={item.widthM}
                      onChange={(event) => {
                        const widthM = Number(event.target.value) || 0;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, widthM } : row)),
                        );
                      }}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1"
                    />
                  ) : (
                    item.widthM || "-"
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={item.lengthM}
                      onChange={(event) => {
                        const lengthM = Number(event.target.value) || 0;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, lengthM } : row)),
                        );
                      }}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1"
                    />
                  ) : (
                    item.lengthM || "-"
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <input
                      type="text"
                      value={item.thickness}
                      onChange={(event) => {
                        const thickness = event.target.value;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, thickness } : row)),
                        );
                      }}
                      className="w-52 rounded-md border border-slate-300 px-2 py-1"
                    />
                  ) : (
                    item.thickness
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <select
                      value={item.installOption}
                      onChange={(event) => {
                        const installOption = event.target.value;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, installOption } : row)),
                        );
                      }}
                      className="w-28 rounded-md border border-slate-300 px-2 py-1"
                    >
                      <option value="ติดตั้ง">ติดตั้ง</option>
                      <option value="ไม่ติดตั้ง">ไม่ติดตั้ง</option>
                    </select>
                  ) : (
                    item.installOption
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => {
                        const quantity = Number(event.target.value) || 1;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, quantity } : row)),
                        );
                      }}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {tab === "แก้ไขรายการ" ? (
                    <input
                      type="number"
                      min={0}
                      value={item.pricePerUnit}
                      onChange={(event) => {
                        const pricePerUnit = Number(event.target.value) || 0;
                        setEditingItems((prev) =>
                          prev.map((row) => (row.id === item.id ? { ...row, pricePerUnit } : row)),
                        );
                      }}
                      className="w-28 rounded-md border border-slate-300 px-2 py-1"
                    />
                  ) : (
                    `${new Intl.NumberFormat("th-TH").format(item.pricePerUnit)} บาท`
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">{item.warranty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FormModal>
  );
}
