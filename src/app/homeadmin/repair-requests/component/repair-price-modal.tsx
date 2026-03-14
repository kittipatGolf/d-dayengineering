import { FormModal } from "../../components/admin-shared/form-modal";

type RepairPriceModalProps = {
  open: boolean;
  price: string;
  onPriceChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function RepairPriceModal({ open, price, onPriceChange, onClose, onConfirm }: RepairPriceModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="แก้ไขราคาซ่อมเริ่มต้น"
      maxWidthClassName="max-w-md"
      footer={
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
            onClick={onConfirm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          placeholder="กรอกราคาใหม่"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
        />
        <span className="text-sm font-semibold text-slate-600">บาท</span>
      </div>
    </FormModal>
  );
}

