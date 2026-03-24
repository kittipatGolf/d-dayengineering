"use client";

import { PlusIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { AddAddressModal } from "@/app/profile/components/add-address-modal";
import { ChangePasswordModal } from "@/app/profile/components/change-password-modal";
import { EditProfileModal } from "@/app/profile/components/edit-profile-modal";
import { ProfileDataTable } from "@/app/profile/components/profile-data-table";
import { ProfileSidebar } from "@/app/profile/components/profile-sidebar";
import { ProfileStatusTabs } from "@/app/profile/components/profile-status-tabs";
import { useAuth } from "@/lib/auth/auth-context";
import { ConfirmModal } from "@/components/confirm-modal";
import { SuccessToast } from "@/components/success-toast";
import { OrderDetailModal } from "@/app/profile/components/order-detail-modal";
import { RepairDetailModal } from "@/app/profile/components/repair-detail-modal";

type ProfileSection = "orders" | "address" | "repair";
type ProfileStatus = "all" | "pending" | "confirmed" | "completed" | "cancelled";

function toSection(value: string | null): ProfileSection {
  if (value === "address") return "address";
  if (value === "repair") return "repair";
  return "orders";
}

function toStatus(value: string | null): ProfileStatus {
  if (value === "pending") return "pending";
  if (value === "confirmed") return "confirmed";
  if (value === "completed") return "completed";
  if (value === "cancelled") return "cancelled";
  return "all";
}

const orderColumns = [
  "ID",
  "ชื่อ",
  "นามสกุล",
  "เบอร์โทรศัพท์",
  "ที่อยู่",
  "รายการสินค้า",
  "ยอดรวมทั้งหมด",
  "สถานะ",
];

const addressColumns = ["ที่อยู่", "จังหวัด", "เขต/อำเภอ", "ตำบล", "รหัสไปรษณีย์", "การกระทำ"];

const repairColumns = ["ประเภทการซ่อม", "สินค้าแจ้งซ่อม", "รายละเอียด", "วันที่แจ้งซ่อม", "ที่อยู่", "รูปภาพ", "สถานะ"];

const statusMap: Record<ProfileStatus, string> = {
  all: "ทั้งหมด",
  pending: "รอการยืนยัน",
  confirmed: "ได้รับการยืนยัน",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
};

const statusToKey: Record<string, ProfileStatus> = {
  "รอการยืนยัน": "pending",
  "ได้รับการยืนยัน": "confirmed",
  "สำเร็จ": "completed",
  "ยกเลิก": "cancelled",
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("th-TH", { style: "currency", currency: "THB" });
}

const sectionTitles: Record<ProfileSection, string> = {
  orders: "คำสั่งซื้อของฉัน",
  address: "ที่อยู่",
  repair: "แจ้งซ่อม",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const section = toSection(searchParams.get("section"));
  const status = toStatus(searchParams.get("status"));

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingDeleteAddressId, setPendingDeleteAddressId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, addressesRes, repairsRes] = await Promise.all([
        fetch("/api/orders/my"),
        fetch("/api/me/addresses"),
        fetch("/api/repair-requests/my"),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(Array.isArray(data) ? data : data.orders ?? []);
      }
      if (addressesRes.ok) {
        const data = await addressesRes.json();
        setAddresses(Array.isArray(data) ? data : data.addresses ?? []);
      }
      if (repairsRes.ok) {
        const data = await repairsRes.json();
        setRepairs(Array.isArray(data) ? data : data.repairRequests ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="mt-3 text-sm text-slate-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Build rows for orders filtered by status
  const filteredOrders = status === "all"
    ? orders
    : orders.filter((o: any) => {
        const key = statusToKey[o.status];
        return key === status;
      });

  const orderRows = filteredOrders.map((o: any) => {
    const addressStr = o.address
      ? typeof o.address === "string"
        ? o.address
        : [o.address.line, o.address.subdistrict, o.address.district, o.address.province, o.address.postalCode].filter(Boolean).join(", ")
      : "-";
    const itemsSummary = Array.isArray(o.items)
      ? o.items.map((i: any) => `${i.name ?? i.productName ?? "สินค้า"} x${i.quantity ?? 1}`).join(", ")
      : "-";
    return [
      o.id ?? o._id ?? "-",
      o.firstName ?? "-",
      o.lastName ?? "-",
      o.phone ?? "-",
      addressStr,
      itemsSummary,
      formatCurrency(o.totalAmount ?? 0),
      o.status ?? "-",
    ];
  });

  // Build rows for addresses
  const addressRows = addresses.map((a: any) => [
    a.line ?? "-",
    a.province ?? "-",
    a.district ?? "-",
    a.subdistrict ?? "-",
    a.postalCode ?? "-",
    a.id ?? a._id ?? "",
  ]);

  // Build rows for repairs filtered by status
  const filteredRepairs = status === "all"
    ? repairs
    : repairs.filter((r: any) => {
        const key = statusToKey[r.status];
        return key === status;
      });

  const repairRows = filteredRepairs.map((r: any) => {
    const addressStr = r.address
      ? typeof r.address === "string"
        ? r.address
        : [r.address.line, r.address.subdistrict, r.address.district, r.address.province, r.address.postalCode].filter(Boolean).join(", ")
      : "-";
    return [
      r.repairType ?? "-",
      r.repairItem ?? "-",
      r.detail ?? "-",
      r.repairDate ?? "-",
      addressStr,
      Array.isArray(r.images) ? `${r.images.length} รูป` : "0 รูป",
      r.status ?? "-",
    ];
  });

  const handleDeleteAddress = (id: string) => {
    setPendingDeleteAddressId(id);
  };

  const confirmDeleteAddress = async () => {
    if (!pendingDeleteAddressId) return;
    const id = pendingDeleteAddressId;
    setPendingDeleteAddressId(null);
    try {
      const res = await fetch(`/api/me/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        setToast("ลบที่อยู่สำเร็จ");
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <UserCircleIcon className="h-7 w-7 text-slate-400" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">โปรไฟล์ของฉัน</h1>
            <p className="text-sm text-slate-500">จัดการข้อมูลส่วนตัวและคำสั่งซื้อ</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <ProfileSidebar
            activeSection={section}
            user={{ firstName: user.firstName, lastName: user.lastName, email: user.email }}
            onEditProfileClick={() => setIsEditProfileModalOpen(true)}
            onChangePasswordClick={() => setIsChangePasswordModalOpen(true)}
          />

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Content header */}
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-slate-800">{sectionTitles[section]}</h2>
            </div>

            <div className="p-5 sm:p-6">
              {section === "orders" ? (
                <>
                  <ProfileStatusTabs section="orders" activeStatus={status} />
                  <div className="mt-5">
                    <ProfileDataTable
                      columns={orderColumns}
                      rows={loading ? [] : orderRows}
                      emptyText={loading ? "กำลังโหลด..." : `ยังไม่มีรายการคำสั่งซื้อในสถานะ: ${statusMap[status]}`}
                      sectionType="orders"
                      onRowClick={(idx) => setSelectedOrder(filteredOrders[idx])}
                    />
                  </div>
                </>
              ) : null}

              {section === "address" ? (
                <ProfileDataTable
                  columns={addressColumns}
                  rows={loading ? [] : addressRows}
                  emptyText={loading ? "กำลังโหลด..." : "ยังไม่มีที่อยู่"}
                  sectionType="address"
                  onDeleteAddress={handleDeleteAddress}
                  topAction={
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                      <PlusIcon className="h-5 w-5" />
                      เพิ่มที่อยู่ใหม่
                    </button>
                  }
                />
              ) : null}

              {section === "repair" ? (
                <>
                  <ProfileStatusTabs section="repair" activeStatus={status} />
                  <div className="mt-5">
                    <ProfileDataTable
                      columns={repairColumns}
                      rows={loading ? [] : repairRows}
                      emptyText={loading ? "กำลังโหลด..." : "ไม่มีรายการแจ้งซ่อม"}
                      sectionType="repair"
                      onRowClick={(idx) => setSelectedRepair(filteredRepairs[idx])}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={() => {
          setIsAddressModalOpen(false);
          fetchData();
          setToast("เพิ่มที่อยู่สำเร็จ");
        }}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        onSuccess={() => {
          setIsEditProfileModalOpen(false);
          fetchData();
        }}
      />
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        open={!!pendingDeleteAddressId}
        message="คุณต้องการลบที่อยู่นี้ใช่หรือไม่?"
        confirmText="ลบ"
        onConfirm={confirmDeleteAddress}
        onCancel={() => setPendingDeleteAddressId(null)}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />

      <OrderDetailModal
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <RepairDetailModal
        open={!!selectedRepair}
        repair={selectedRepair}
        onClose={() => setSelectedRepair(null)}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-3 text-sm text-slate-500">กำลังโหลด...</p>
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
