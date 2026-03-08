import { ImageUploadField } from "@/app/repair/components/image-upload-field";
import { RepairSelectField } from "@/app/repair/components/repair-select-field";

export default function RepairPage() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-center text-[32px] font-bold text-slate-900">แจ้งซ่อม</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-10">
        <div className="mb-8 flex justify-end">
          <p className="text-[24px] font-semibold text-slate-600">ค่าซ่อมเริ่มต้น 3,000 บาท</p>
        </div>

        <form className="space-y-5 text-[16px]">
          <RepairSelectField
            id="repair-type"
            label="ประเภทการซ่อม"
            placeholder="*เลือกประเภทบริการ"
            options={["ประตูม้วนไฟฟ้า", "ประตูม้วนมือดึง", "ประตูม้วนรอกโซ่"]}
          />

          <div className="space-y-2">
            <RepairSelectField
              id="problem-type"
              label="รายละเอียดปัญหา"
              placeholder="ปัญหาที่พบบ่อย"
              options={[
                "ประตูติดขัด เปิด-ปิดไม่ได้",
                "มอเตอร์ไม่ทำงาน",
                "รีโมทหรือสวิตช์ควบคุมเสีย",
              ]}
            />
            <textarea
              rows={4}
              placeholder="หรือพิมพ์รายละเอียดเพิ่มเติม"
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <RepairSelectField
            id="address-book"
            label="เลือกที่อยู่จัดส่ง"
            placeholder="เลือกที่อยู่"
            options={["บ้าน", "ออฟฟิศ"]}
          />

          <div className="space-y-2">
            <label htmlFor="address-detail" className="font-medium text-slate-700">
              ที่อยู่
            </label>
            <textarea
              id="address-detail"
              rows={3}
              placeholder="*บ้านเลขที่ ถนน ซอย"
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <RepairSelectField
            id="province"
            label="จังหวัด/เมือง"
            placeholder="*เลือกจังหวัด"
            options={["กรุงเทพมหานคร", "นนทบุรี", "สมุทรปราการ"]}
          />

          <RepairSelectField
            id="district"
            label="เลือกเขต/อำเภอ"
            placeholder="*เลือกเขต/อำเภอ"
            options={["บางนา", "ลาดกระบัง", "เมืองนนทบุรี"]}
          />

          <RepairSelectField
            id="sub-district"
            label="ตำบล"
            placeholder="*เลือกตำบล"
            options={["บางนาเหนือ", "คลองสองต้นนุ่น", "สวนใหญ่"]}
          />

          <div className="space-y-2">
            <label htmlFor="postcode" className="font-medium text-slate-700">
              รหัสไปรษณีย์
            </label>
            <input
              id="postcode"
              type="text"
              placeholder="รหัสไปรษณีย์"
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <ImageUploadField />

          <div className="pt-4 text-center">
            <button
              type="button"
              className="rounded bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              เข้าสู่ระบบเพื่อแจ้งซ่อม
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
