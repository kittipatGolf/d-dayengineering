"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { ImageUploadField } from "@/app/repair/components/image-upload-field";
import { RepairSelectField } from "@/app/repair/components/repair-select-field";
import { ThaiAddressInput, type ThaiAddressValue } from "@/components/thai-address-input";
import {
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

type SavedAddress = {
  id: string;
  line: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
};

const repairTypeOptions = [
  "ประตูม้วนไฟฟ้า",
  "ประตูม้วนมือดึง",
  "ประตูม้วนรอกโซ่",
  "อะไหล่ประตูม้วน",
  "อื่นๆ",
];

const problemOptions: Record<string, string[]> = {
  "ประตูม้วนไฟฟ้า": [
    "ประตูติดขัด เปิด-ปิดไม่ได้",
    "มอเตอร์ไม่ทำงาน / มีเสียงดังผิดปกติ",
    "รีโมทหรือสวิตช์ควบคุมเสีย",
    "ประตูเปิด-ปิดไม่สุด",
    "ประตูตกลงมาเอง / ไม่ล็อค",
    "ระบบไฟฟ้าลัดวงจร / ไฟไม่เข้า",
    "แผ่นประตูบุบ / งอ / เสียหาย",
    "อื่นๆ",
  ],
  "ประตูม้วนมือดึง": [
    "ประตูติดขัด ดึงไม่ขึ้น",
    "สปริงหมดแรง / สปริงขาด",
    "ตัวล็อคชำรุด / ล็อคไม่ได้",
    "แผ่นประตูบุบ / งอ / เสียหาย",
    "รางประตูคด / ฝืด",
    "อื่นๆ",
  ],
  "ประตูม้วนรอกโซ่": [
    "โซ่ขาด / โซ่หลุด",
    "รอกชำรุด / หมุนไม่ได้",
    "ประตูติดขัด เปิด-ปิดไม่ได้",
    "ตัวล็อคชำรุด / ล็อคไม่ได้",
    "แผ่นประตูบุบ / งอ / เสียหาย",
    "รางประตูคด / ฝืด",
    "อื่นๆ",
  ],
  "อะไหล่ประตูม้วน": [
    "ต้องการเปลี่ยนมอเตอร์",
    "ต้องการเปลี่ยนรีโมท / สวิตช์",
    "ต้องการเปลี่ยนสปริง",
    "ต้องการเปลี่ยนโซ่ / รอก",
    "ต้องการเปลี่ยนแผ่นประตู",
    "ต้องการเปลี่ยนราง / อุปกรณ์อื่น",
    "อื่นๆ",
  ],
  "อื่นๆ": ["อื่นๆ"],
};

export default function RepairPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [repairType, setRepairType] = useState("");
  const [problemType, setProblemType] = useState("");
  const [detail, setDetail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressFields, setAddressFields] = useState<ThaiAddressValue>({
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });
  const [images, setImages] = useState<string[]>([]);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch saved addresses when user is logged in
  useEffect(() => {
    if (!user) return;
    fetch("/api/me/addresses")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedAddress[]) => setSavedAddresses(data))
      .catch(() => setSavedAddresses([]));
  }, [user]);

  // Build address select options
  const addressOptions = savedAddresses.map(
    (a) => `${a.line}, ${a.subdistrict}, ${a.district}, ${a.province} ${a.postalCode}`
  );

  const handleAddressSelect = (label: string) => {
    const index = addressOptions.indexOf(label);
    if (index === -1) return;
    const a = savedAddresses[index];
    setSelectedAddressId(a.id);
    setAddressLine(a.line);
    setAddressFields({
      province: a.province,
      district: a.district,
      subdistrict: a.subdistrict,
      postalCode: a.postalCode,
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Validate required fields
    if (!repairType) {
      setError("กรุณาเลือกประเภทการซ่อม");
      return;
    }
    if (!addressLine || !addressFields.province || !addressFields.district || !addressFields.subdistrict || !addressFields.postalCode) {
      setError("กรุณากรอกที่อยู่ให้ครบถ้วน");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/repair-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repairType,
          repairItem: problemType || "อื่นๆ",
          detail,
          address: {
            line: addressLine,
            province: addressFields.province,
            district: addressFields.district,
            subdistrict: addressFields.subdistrict,
            postalCode: addressFields.postalCode,
          },
          images,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      setSuccess(true);
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  // Success view
  if (success) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Success header */}
          <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 px-6 py-10 text-center text-white">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <CheckCircleIcon className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">ส่งคำขอแจ้งซ่อมสำเร็จ</h2>
              <p className="mt-2 text-emerald-100">เราได้รับคำขอของคุณแล้ว จะติดต่อกลับโดยเร็วที่สุด</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push("/profile?section=repair")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <ClipboardDocumentListIcon className="h-5 w-5" />
              ดูประวัติการแจ้งซ่อม
            </button>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setRepairType("");
                setProblemType("");
                setDetail("");
                setAddressLine("");
                setAddressFields({ province: "", district: "", subdistrict: "", postalCode: "" });
                setImages([]);
                setSelectedAddressId("");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              <ArrowPathIcon className="h-5 w-5" />
              แจ้งซ่อมอีกครั้ง
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-8 text-white shadow-lg md:px-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <WrenchScrewdriverIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">แจ้งซ่อม</h1>
            <p className="mt-1 text-sm text-blue-200/80">แจ้งปัญหาประตูม้วนของคุณ ทีมช่างพร้อมให้บริการ</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Price banner */}
        <div className="border-b border-slate-100 bg-amber-50 px-6 py-3.5">
          <p className="text-center text-sm font-semibold text-amber-800">
            ค่าซ่อมเริ่มต้น 3,000 บาท
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form
            className="space-y-5 text-sm sm:text-base"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <RepairSelectField
              id="repair-type"
              label="ประเภทการซ่อม"
              placeholder="*เลือกประเภทบริการ"
              options={repairTypeOptions}
              value={repairType}
              onSelect={(v) => {
                setRepairType(v);
                setProblemType("");
              }}
            />

            <div className="space-y-2">
              <RepairSelectField
                id="problem-type"
                label="รายละเอียดปัญหา"
                placeholder={repairType ? "เลือกปัญหาที่พบ" : "เลือกประเภทการซ่อมก่อน"}
                options={problemOptions[repairType] ?? []}
                value={problemType}
                onSelect={setProblemType}
                disabled={!repairType}
              />
              <textarea
                rows={4}
                placeholder="หรือพิมพ์รายละเอียดเพิ่มเติม"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {user && savedAddresses.length > 0 && (
              <RepairSelectField
                id="address-book"
                label="เลือกที่อยู่ที่บันทึกไว้"
                placeholder="เลือกที่อยู่"
                options={addressOptions}
                value={
                  selectedAddressId
                    ? addressOptions[savedAddresses.findIndex((a) => a.id === selectedAddressId)] ?? ""
                    : ""
                }
                onSelect={handleAddressSelect}
              />
            )}

            <div className="space-y-2">
              <label htmlFor="address-detail" className="font-medium text-slate-700">
                ที่อยู่
              </label>
              <textarea
                id="address-detail"
                rows={3}
                placeholder="*บ้านเลขที่ ถนน ซอย"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <ThaiAddressInput
              value={addressFields}
              onChange={setAddressFields}
              inputClassName="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              labelClassName="font-medium text-slate-700"
            />

            <ImageUploadField value={images} onChange={setImages} />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="pt-2">
              {!authLoading && !user ? (
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  เข้าสู่ระบบเพื่อแจ้งซ่อม
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" />
                      ส่งคำขอแจ้งซ่อม
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
