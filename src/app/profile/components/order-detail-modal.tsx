import { XMarkIcon } from "@heroicons/react/24/outline";

/* eslint-disable @typescript-eslint/no-explicit-any */
type OrderDetailModalProps = {
  open: boolean;
  order: any;
  onClose: () => void;
};

function formatCurrency(amount: number) {
  return amount.toLocaleString("th-TH", { style: "currency", currency: "THB" });
}

function formatAddress(address: any) {
  if (!address) return "-";
  if (typeof address === "string") return address;
  return [address.line, address.subdistrict, address.district, address.province, address.postalCode]
    .filter(Boolean)
    .join(", ");
}

export function OrderDetailModal({ open, order, onClose }: OrderDetailModalProps) {
  if (!open || !order) return null;

  const items: any[] = Array.isArray(order.items) ? order.items : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      >
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-xl font-bold text-slate-900">รายละเอียดคำสั่งซื้อ</h2>
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
            {/* Order info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold text-slate-700">ชื่อ:</span>{" "}
                <span className="text-slate-600">{order.firstName} {order.lastName}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">เบอร์โทร:</span>{" "}
                <span className="text-slate-600">{order.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">ที่อยู่:</span>{" "}
                <span className="text-slate-600">{formatAddress(order.address)}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">สถานะ:</span>{" "}
                <span className="text-slate-600">{order.status}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">ยอดรวม:</span>{" "}
                <span className="font-bold text-blue-700">{formatCurrency(order.totalAmount ?? 0)}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3">รายการสินค้า ({items.length} รายการ)</h3>
              {items.length === 0 ? (
                <p className="text-slate-400 text-sm">ไม่มีรายการสินค้า</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div key={item.id ?? idx} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start gap-4">
                        {item.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-16 w-16 rounded-lg border border-slate-200 object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.categoryName}</p>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                            <span>สี: {item.color || "-"}</span>
                            <span>ความหนา: {item.thickness || "-"}</span>
                            <span>กว้าง: {item.widthM} ม.</span>
                            <span>ยาว: {item.lengthM} ม.</span>
                            <span>ติดตั้ง: {item.installOption || "-"}</span>
                            <span>การรับประกัน: {item.warranty || "-"}</span>
                            <span>จำนวน: {item.quantity}</span>
                            <span className="font-semibold text-blue-700">
                              ราคา: {formatCurrency(item.pricePerUnit * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
