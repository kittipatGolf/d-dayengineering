"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  XMarkIcon,
  MapPinIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { ThaiAddressInput, type ThaiAddressValue } from "@/components/thai-address-input";

type SavedAddress = {
  id: string;
  line: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    line: string;
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
  };
};

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalAmount } =
    useCart();
  const { user, isLoading: authLoading } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [saveAddress, setSaveAddress] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      line: "",
      province: "",
      district: "",
      subdistrict: "",
      postalCode: "",
    },
  });

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/me/addresses");
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch saved addresses:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
      }));
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setForm((prev) => ({
      ...prev,
      address: {
        line: addr.line,
        province: addr.province,
        district: addr.district,
        subdistrict: addr.subdistrict,
        postalCode: addr.postalCode,
      },
    }));
  };

  const handleClearAddress = () => {
    setSelectedAddressId(null);
    setForm((prev) => ({
      ...prev,
      address: { line: "", province: "", district: "", subdistrict: "", postalCode: "" },
    }));
  };

  const handlePlaceOrder = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.address.line.trim() ||
      !form.address.province.trim() ||
      !form.address.district.trim() ||
      !form.address.subdistrict.trim() ||
      !form.address.postalCode.trim()
    ) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        name: item.name,
        categoryName: item.categoryName,
        images: item.images,
        color: item.color,
        widthM: item.widthM,
        lengthM: item.lengthM,
        thickness: item.thickness,
        installOption: item.installOption,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        warranty: item.warranty,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          address: {
            line: form.address.line,
            province: form.address.province,
            district: form.address.district,
            subdistrict: form.address.subdistrict,
            postalCode: form.address.postalCode,
          },
          items: orderItems,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }

      // Save address if checkbox is checked
      if (saveAddress && !selectedAddressId) {
        fetch("/api/me/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form.address),
        }).catch((err) => console.error("Failed to save address:", err));
      }

      clearCart();
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile?section=orders");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Empty cart ---------- */
  if (!authLoading && items.length === 0 && !success) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
          <ShoppingCartIcon className="h-14 w-14 text-slate-300" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800">
          ตะกร้าสินค้าว่างเปล่า
        </h1>
        <p className="mt-2 text-slate-500">
          ยังไม่มีสินค้าในตะกร้า เลือกสินค้าที่ต้องการแล้วเพิ่มลงตะกร้าได้เลย
        </p>
        <button
          type="button"
          onClick={() => router.push("/doors")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          เลือกซื้อสินค้า
        </button>
      </div>
    );
  }

  /* ---------- Success ---------- */
  if (success) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircleIcon className="h-14 w-14 text-emerald-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800">
          สั่งซื้อสำเร็จ!
        </h1>
        <p className="mt-2 text-slate-500">
          คำสั่งซื้อของคุณถูกบันทึกเรียบร้อยแล้ว กำลังนำคุณไปยังหน้าคำสั่งซื้อ...
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm text-blue-600">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          กำลังเปลี่ยนหน้า...
        </div>
      </div>
    );
  }

  /* ---------- Cart with items ---------- */
  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Hero header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-8 text-white shadow-lg">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <ShoppingCartIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ตะกร้าสินค้า</h1>
                <p className="mt-0.5 text-sm text-blue-200/80">ตรวจสอบรายการและดำเนินการสั่งซื้อ</p>
              </div>
            </div>
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              {items.length} รายการ
            </span>
          </div>
        </div>

        {/* Cart items */}
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartId}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* Image */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    ไม่มีรูป
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-slate-800">
                  {item.name}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  หมวดหมู่: {item.categoryName}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    สี: {item.color}
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {item.widthM} x {item.lengthM} ม.
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    หนา: {item.thickness}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-blue-600">
                  ฿{item.pricePerUnit.toLocaleString()} / ชิ้น
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
                {/* Quantity controls */}
                <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                  <button
                    type="button"
                    aria-label="ลดจำนวน"
                    onClick={() =>
                      updateQuantity(item.cartId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="px-3 py-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-10 border-x border-slate-200 text-center text-sm font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="เพิ่มจำนวน"
                    onClick={() =>
                      updateQuantity(item.cartId, item.quantity + 1)
                    }
                    className="px-3 py-2 text-slate-500 transition hover:bg-slate-50"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-lg font-bold text-slate-800">
                  ฿{(item.pricePerUnit * item.quantity).toLocaleString()}
                </p>

                {/* Remove */}
                <button
                  type="button"
                  aria-label="ลบสินค้า"
                  onClick={() => removeItem(item.cartId)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-50 px-6 py-4">
            <h3 className="text-sm font-bold text-slate-600">สรุปคำสั่งซื้อ</h3>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">ยอดรวมทั้งหมด</span>
              <span className="text-2xl font-bold text-slate-800">
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-lg font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99]"
            >
              สั่งซื้อ
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Checkout Modal ---------- */}
      {showCheckout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => { if (e.key === "Escape") setShowCheckout(false); }}
          onClick={() => setShowCheckout(false)}
        >
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              aria-label="ปิด"
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-800">
              ข้อมูลการสั่งซื้อ
            </h2>
            <p className="mt-1 text-sm text-slate-500">กรอกข้อมูลสำหรับจัดส่งสินค้า</p>

            <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-firstName" className="mb-1.5 block text-sm font-medium text-slate-700">
                    ชื่อ
                  </label>
                  <input
                    id="checkout-firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, firstName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-lastName" className="mb-1.5 block text-sm font-medium text-slate-700">
                    นามสกุล
                  </label>
                  <input
                    id="checkout-lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, lastName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    <MapPinIcon className="mr-1 inline h-4 w-4" />
                    เลือกที่อยู่ที่บันทึกไว้
                  </label>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectAddress(addr)}
                        className={`w-full rounded-xl border p-3.5 text-left text-sm transition ${
                          selectedAddressId === addr.id
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {addr.line}, {addr.subdistrict}, {addr.district},{" "}
                        {addr.province} {addr.postalCode}
                      </button>
                    ))}
                    {selectedAddressId && (
                      <button
                        type="button"
                        onClick={handleClearAddress}
                        className="text-sm text-slate-500 underline hover:text-slate-700"
                      >
                        กรอกที่อยู่เอง
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Address fields */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">ที่อยู่จัดส่ง</p>
                <div>
                  <label htmlFor="checkout-address" className="mb-1.5 block text-sm text-slate-600">
                    ที่อยู่
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address.line}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        address: { ...p.address, line: e.target.value },
                      }))
                    }
                    placeholder="เลขที่ ซอย ถนน"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <ThaiAddressInput
                  value={{
                    province: form.address.province,
                    district: form.address.district,
                    subdistrict: form.address.subdistrict,
                    postalCode: form.address.postalCode,
                  }}
                  onChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      address: { ...p.address, ...v },
                    }))
                  }
                  inputClassName="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  labelClassName="mb-1.5 block text-sm text-slate-600"
                />
              </div>

              {/* Save address option */}
              {user && !selectedAddressId && (
                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  บันทึกที่อยู่นี้สำหรับครั้งถัดไป
                </label>
              )}

              {/* Order summary in modal */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-700">
                  สรุปรายการ ({items.length} รายการ)
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {items.map((item) => (
                    <li
                      key={item.cartId}
                      className="flex justify-between text-sm text-slate-600"
                    >
                      <span className="truncate pr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        ฿{(item.pricePerUnit * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-800">
                  <span>รวมทั้งหมด</span>
                  <span className="text-blue-700">฿{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-2 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      ยืนยันสั่งซื้อ
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
