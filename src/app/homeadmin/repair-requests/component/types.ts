import type { HistoryAddress } from "@/app/homeadmin/history/component/types";

export type RepairRequestStatus = "รอการยืนยัน" | "ได้รับการยืนยัน" | "สำเร็จ" | "ยกเลิก";

export type RepairRequestItem = {
  id: string;
  username: string;
  repairType: string;
  repairItem: string;
  detail: string;
  repairDate: string;
  address: HistoryAddress;
  images: string[];
  selectedPart: string;
  warranty: string;
  repairPrice: number;
  status: RepairRequestStatus;
};

