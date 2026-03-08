import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type AddAddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const selectClassName =
  "w-full appearance-none rounded border border-slate-300 bg-white px-4 py-2 pr-10 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function AddAddressModal({ isOpen, onClose }: AddAddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[540px] rounded-md bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-[32px] font-bold text-slate-700">เพิ่มที่อยู่ใหม่</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิด"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form className="space-y-3">
          <div>
            <label htmlFor="address-line" className="mb-1 block font-semibold text-slate-700">
              * ที่อยู่
            </label>
            <input
              id="address-line"
              type="text"
              placeholder="บ้านเลขที่ ถนน ซอย"
              className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="province" className="mb-1 block font-semibold text-slate-700">
              * จังหวัด/เมือง
            </label>
            <div className="relative">
              <select id="province" defaultValue="" className={selectClassName}>
                <option value="" disabled>
                  เลือกจังหวัด
                </option>
                <option>ชลบุรี</option>
                <option>ระยอง</option>
                <option>กรุงเทพมหานคร</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label htmlFor="district" className="mb-1 block font-semibold text-slate-700">
              * เขต/อำเภอ
            </label>
            <div className="relative">
              <select id="district" defaultValue="" className={selectClassName}>
                <option value="" disabled>
                  เลือกเขต
                </option>
                <option>ศรีราชา</option>
                <option>ปลวกแดง</option>
                <option>บางนา</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label htmlFor="subdistrict" className="mb-1 block font-semibold text-slate-700">
              * ตำบล
            </label>
            <div className="relative">
              <select id="subdistrict" defaultValue="" className={selectClassName}>
                <option value="" disabled>
                  เลือกตำบล
                </option>
                <option>เขาคันทรง</option>
                <option>บ่อวิน</option>
                <option>หนองขาม</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label htmlFor="postcode" className="mb-1 block font-semibold text-slate-700">
              * รหัสไปรษณีย์
            </label>
            <input
              id="postcode"
              type="text"
              className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            className="mt-2 w-full rounded bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400"
          >
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}
