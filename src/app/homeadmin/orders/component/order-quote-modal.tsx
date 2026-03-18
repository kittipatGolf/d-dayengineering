import { PrinterIcon } from "@heroicons/react/24/outline";
import { FormModal } from "../../components/admin-shared/form-modal";
import type { OrderRecord } from "./types";

type OrderQuoteModalProps = {
  open: boolean;
  order: OrderRecord | null;
  onClose: () => void;
};

function buildPrintHtml(order: OrderRecord, subtotal: number, vat: number, grandTotal: number) {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.pricePerUnit.toLocaleString("th-TH")}</td>
        <td>${item.widthM} x ${item.lengthM} x ${item.thickness}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>ใบประเมินราคาเบื้องต้น ${order.id}</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; margin: 24px; color: #111827; }
          .center { text-align: center; }
          .title { font-size: 30px; font-weight: 700; }
          .company { font-size: 24px; font-weight: 700; margin-top: 8px; }
          .note { color: #dc2626; font-weight: 700; margin-bottom: 12px; }
          .row { display: flex; justify-content: space-between; margin-top: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #374151; padding: 8px; font-size: 14px; }
          th { background: #f3f4f6; text-align: left; }
          .totals { margin-top: 20px; margin-left: auto; width: 320px; }
          .totals p { display: flex; justify-content: space-between; margin: 8px 0; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="center">
          <div class="note">*หมายเหตุ: ราคาที่ปรากฏเป็นเพียงการประเมินราคาเบื้องต้น ซึ่งอาจมีการเปลี่ยนแปลงราคาในภายหลัง</div>
          <div class="company">บริษัท ดีย์แปด ประตูม้วน จำกัด</div>
          <div>40/7 ม.2 ต.มาบยางพร อ.ปลวกแดง จ.ระยอง 21140</div>
          <div>โทร 091-834-8666, 062-545-0777</div>
          <div>เลขที่ผู้เสียภาษี 0215568001551</div>
          <h2>ใบประเมินราคาเบื้องต้น<br/>Preliminary Price Estimate</h2>
        </div>

        <div class="row">
          <div></div>
          <div>
            <div>หมายเลขคำสั่งซื้อ: ${order.id.replace("OD-", "")}</div>
            <div>วันที่สั่งซื้อ: ${order.createdAt}</div>
          </div>
        </div>

        <h3>ข้อมูลลูกค้า</h3>
        <table>
          <tr><th>ชื่อ-สกุล</th><td>${order.firstName} ${order.lastName}</td></tr>
          <tr><th>เบอร์โทร</th><td>${order.phone}</td></tr>
        </table>

        <h3>ข้อมูลที่อยู่จัดส่ง</h3>
        <table>
          <tr><th>ที่อยู่</th><td>${order.address.line}</td></tr>
          <tr><th>ตำบล/แขวง</th><td>${order.address.subdistrict}</td></tr>
          <tr><th>อำเภอ/เขต</th><td>${order.address.district}</td></tr>
          <tr><th>จังหวัด</th><td>${order.address.province}</td></tr>
          <tr><th>รหัสไปรษณีย์</th><td>${order.address.postalCode}</td></tr>
        </table>

        <h3>ข้อมูลสินค้าในออเดอร์</h3>
        <table>
          <thead>
            <tr>
              <th>ชื่อสินค้า</th>
              <th>จำนวน</th>
              <th>ราคา/ชิ้น</th>
              <th>ขนาด (กว้าง x ยาว x ความหนา)</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div class="totals">
          <p><span>ยอดรวมก่อน VAT :</span><span>${subtotal.toLocaleString("th-TH")} บาท</span></p>
          <p><span>ภาษีมูลค่าเพิ่ม 7% :</span><span>${vat.toLocaleString("th-TH")} บาท</span></p>
          <p><span>ยอดรวมทั้งหมด :</span><span>${grandTotal.toLocaleString("th-TH")} บาท</span></p>
        </div>
      </body>
    </html>
  `;
}

export function OrderQuoteModal({ open, order, onClose }: OrderQuoteModalProps) {
  if (!order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
  const vat = Math.round(subtotal * 0.07);
  const grandTotal = subtotal + vat;

  const onPrint = () => {
    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) return;
    printWindow.document.write(buildPrintHtml(order, subtotal, vat, grandTotal));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="ใบประเมินราคาเบื้องต้น"
      maxWidthClassName="max-w-6xl"
      footer={
        <div className="ml-auto">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <PrinterIcon className="h-4 w-4" />
            พิมพ์ PDF
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-slate-800">
        <p className="text-center text-sm font-semibold text-rose-600">
          *หมายเหตุ: ราคาที่ปรากฏเป็นเพียงการประเมินราคาเบื้องต้น ซึ่งอาจมีการเปลี่ยนแปลงราคาในภายหลัง
        </p>
        <div className="text-center">
          <h2 className="text-2xl font-bold">บริษัท ดีย์แปด ประตูม้วน จำกัด</h2>
          <p className="text-sm">40/7 ม.2 ต.มาบยางพร อ.ปลวกแดง จ.ระยอง 21140</p>
          <p className="text-sm">โทร 091-834-8666, 062-545-0777</p>
          <p className="text-sm">เลขที่ผู้เสียภาษี 0215568001551</p>
          <p className="mt-3 text-2xl font-bold">ใบประเมินราคาเบื้องต้น</p>
          <p className="text-2xl font-bold">Preliminary Price Estimate</p>
        </div>

        <div className="flex justify-end text-sm">
          <div className="space-y-1">
            <p>หมายเลขคำสั่งซื้อ: {order.id.replace("OD-", "")}</p>
            <p>วันที่สั่งซื้อ: {order.createdAt}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold">ข้อมูลลูกค้า</h3>
        <table className="min-w-full border border-slate-400 text-sm">
          <tbody>
            <tr className="border-b border-slate-400">
              <td className="w-1/4 border-r border-slate-400 px-2 py-1.5 font-medium">ชื่อ-สกุล</td>
              <td className="px-2 py-1.5">{order.firstName} {order.lastName}</td>
            </tr>
            <tr>
              <td className="border-r border-slate-400 px-2 py-1.5 font-medium">เบอร์โทร</td>
              <td className="px-2 py-1.5">{order.phone}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold">ข้อมูลที่อยู่จัดส่ง</h3>
        <table className="min-w-full border border-slate-400 text-sm">
          <tbody>
            <tr className="border-b border-slate-400"><td className="w-1/4 border-r border-slate-400 px-2 py-1.5 font-medium">ที่อยู่</td><td className="px-2 py-1.5">{order.address.line}</td></tr>
            <tr className="border-b border-slate-400"><td className="border-r border-slate-400 px-2 py-1.5 font-medium">ตำบล/แขวง</td><td className="px-2 py-1.5">{order.address.subdistrict}</td></tr>
            <tr className="border-b border-slate-400"><td className="border-r border-slate-400 px-2 py-1.5 font-medium">อำเภอ/เขต</td><td className="px-2 py-1.5">{order.address.district}</td></tr>
            <tr className="border-b border-slate-400"><td className="border-r border-slate-400 px-2 py-1.5 font-medium">จังหวัด</td><td className="px-2 py-1.5">{order.address.province}</td></tr>
            <tr><td className="border-r border-slate-400 px-2 py-1.5 font-medium">รหัสไปรษณีย์</td><td className="px-2 py-1.5">{order.address.postalCode}</td></tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold">ข้อมูลสินค้าในออเดอร์</h3>
        <table className="min-w-full border border-slate-400 text-sm">
          <thead className="border-b border-slate-400 bg-slate-50">
            <tr>
              <th className="border-r border-slate-400 px-2 py-1.5 text-left">ชื่อสินค้า</th>
              <th className="border-r border-slate-400 px-2 py-1.5 text-left">จำนวน</th>
              <th className="border-r border-slate-400 px-2 py-1.5 text-left">ราคา/ชิ้น</th>
              <th className="px-2 py-1.5 text-left">ขนาด (กว้าง x ยาว x ความหนา)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-300 last:border-0">
                <td className="border-r border-slate-300 px-2 py-1.5">{item.name}</td>
                <td className="border-r border-slate-300 px-2 py-1.5">{item.quantity}</td>
                <td className="border-r border-slate-300 px-2 py-1.5">{new Intl.NumberFormat("th-TH").format(item.pricePerUnit)}</td>
                <td className="px-2 py-1.5">{item.widthM} x {item.lengthM} x {item.thickness}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-sm space-y-2 text-right text-base font-semibold">
          <p>ยอดรวมก่อน VAT : {new Intl.NumberFormat("th-TH").format(subtotal)} บาท</p>
          <p>ภาษีมูลค่าเพิ่ม 7% : {new Intl.NumberFormat("th-TH").format(vat)} บาท</p>
          <p>ยอดรวมทั้งหมด : {new Intl.NumberFormat("th-TH").format(grandTotal)} บาท</p>
        </div>
      </div>
    </FormModal>
  );
}

