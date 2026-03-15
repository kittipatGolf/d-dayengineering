"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { ThaiAddressInput, type ThaiAddressValue } from "@/components/thai-address-input";

type AddAddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const inputClassName =
  "w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyAddress: ThaiAddressValue = { province: "", district: "", subdistrict: "", postalCode: "" };

export function AddAddressModal({ isOpen, onClose, onSuccess }: AddAddressModalProps) {
  const [line, setLine] = useState("");
  const [addr, setAddr] = useState<ThaiAddressValue>(emptyAddress);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  function resetForm() {
    setLine("");
    setAddr(emptyAddress);
    setError("");
  }

  async function handleSubmit() {
    if (!line || !addr.province || !addr.district || !addr.subdistrict || !addr.postalCode) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/me/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line, province: addr.province, district: addr.district, subdistrict: addr.subdistrict, postalCode: addr.postalCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด");
        setIsSubmitting(false);
        return;
      }

      resetForm();
      onSuccess?.();
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[540px] rounded-md bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-[32px] font-bold text-slate-700">เพิ่มที่อยู่ใหม่</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิด"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div>
            <label htmlFor="address-line" className="mb-1 block font-semibold text-slate-700">
              * ที่อยู่
            </label>
            <input
              id="address-line"
              type="text"
              placeholder="บ้านเลขที่ ถนน ซอย"
              value={line}
              onChange={(e) => { setLine(e.target.value); setError(""); }}
              className={inputClassName}
            />
          </div>

          <ThaiAddressInput
            value={addr}
            onChange={(v) => { setAddr(v); setError(""); }}
            inputClassName={inputClassName}
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      </div>
    </div>
  );
}
