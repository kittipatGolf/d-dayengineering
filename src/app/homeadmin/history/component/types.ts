export type HistoryStatus = "สำเร็จ" | "ยกเลิก";

export type HistoryAddress = {
  line: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
};

export type RepairHistoryItem = {
  id: string;
  username: string;
  images: string[];
  repairType: string;
  repairItem: string;
  detail: string;
  repairDate: string;
  address: HistoryAddress;
  status: HistoryStatus;
  price: number;
};

export type ProductHistoryLineItem = {
  id: string;
  name: string;
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

export type ProductHistoryItem = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: HistoryAddress;
  items: ProductHistoryLineItem[];
  totalAmount: number;
  status: HistoryStatus;
  completedAt: string;
};

