import type { HistoryAddress } from "@/app/homeadmin/history/component/types";

export type OrderStatus = "รอการยืนยัน" | "ได้รับการยืนยัน" | "สำเร็จ" | "ยกเลิก";

export type OrderItem = {
  id: string;
  name: string;
  categoryName?: string;
  images: string[];
  color: string;
  widthM: number;
  lengthM: number;
  thickness: string;
  installOption: string;
  quantity: number;
  pricePerUnit: number;
  warranty: string;
};

export type OrderRecord = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: HistoryAddress;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};
