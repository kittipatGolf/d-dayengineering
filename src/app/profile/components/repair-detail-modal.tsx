import { XMarkIcon } from "@heroicons/react/24/outline";

/* eslint-disable @typescript-eslint/no-explicit-any */
type RepairDetailModalProps = {
  open: boolean;
  repair: any;
  onClose: () => void;
};

function formatAddress(address: any) {
  if (!address) return "-";
  if (typeof address === "string") return address;
  return [address.line, address.subdistrict, address.district, address.province, address.postalCode]
    .filter(Boolean)
    .join(", ");
}

export function RepairDetailModal({ open, repair, onClose }: RepairDetailModalProps) {
  if (!open || !repair) return null;

  const images: string[] = Array.isArray(repair.images) ? repair.images : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      >
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-xl font-bold text-slate-900">รายละเอียดแจ้งซ่อม</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
              aria-label="ปิด"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto p-5 space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold text-slate-700">ประเภทการซ่อม:</span>{" "}
                <span className="text-slate-600">{repair.repairType}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">สินค้าแจ้งซ่อม:</span>{" "}
                <span className="text-slate-600">{repair.repairItem}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">รายละเอียด:</span>{" "}
                <span className="text-slate-600">{repair.detail || "-"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">วันที่แจ้งซ่อม:</span>{" "}
                <span className="text-slate-600">{repair.repairDate || "-"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">สถานะ:</span>{" "}
                <span className="text-slate-600">{repair.status}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">ที่อยู่:</span>{" "}
                <span className="text-slate-600">{formatAddress(repair.address)}</span>
              </div>
              {repair.selectedPart && (
                <div>
                  <span className="font-semibold text-slate-700">อะไหล่ที่เลือก:</span>{" "}
                  <span className="text-slate-600">{repair.selectedPart}</span>
                </div>
              )}
              {repair.repairPrice > 0 && (
                <div>
                  <span className="font-semibold text-slate-700">ราคาซ่อม:</span>{" "}
                  <span className="font-bold text-blue-700">{repair.repairPrice.toLocaleString()} บาท</span>
                </div>
              )}
              {repair.warranty && (
                <div>
                  <span className="font-semibold text-slate-700">การรับประกัน:</span>{" "}
                  <span className="text-slate-600">{repair.warranty}</span>
                </div>
              )}
            </div>

            {/* Images */}
            {images.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3">รูปภาพ ({images.length} รูป)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((src, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={idx}
                      src={src}
                      alt={`รูปที่ ${idx + 1}`}
                      className="w-full rounded-lg border border-slate-200 object-cover aspect-square"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
