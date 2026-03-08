"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AddAddressModal } from "@/app/profile/components/add-address-modal";
import { ChangePasswordModal } from "@/app/profile/components/change-password-modal";
import { EditProfileModal } from "@/app/profile/components/edit-profile-modal";
import { ProfileDataTable } from "@/app/profile/components/profile-data-table";
import { ProfileSidebar } from "@/app/profile/components/profile-sidebar";
import { ProfileStatusTabs } from "@/app/profile/components/profile-status-tabs";

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
  "สรุปออเดอร์",
];

const addressColumns = ["ที่อยู่", "จังหวัด", "เขต/อำเภอ", "ตำบล", "รหัสไปรษณีย์", "การกระทำ"];

const repairColumns = ["ประเภทการซ่อม", "สินค้าแจ้งซ่อม", "รายละเอียด", "วันที่แจ้งซ่อม", "ที่อยู่", "รูปภาพ", "สถานะ"];

const statusText: Record<ProfileStatus, string> = {
  all: "ทั้งหมด",
  pending: "รอการยืนยัน",
  confirmed: "ได้รับการยืนยันแล้ว",
  completed: "เสร็จแล้ว",
  cancelled: "ยกเลิก",
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const section = toSection(searchParams.get("section"));
  const status = toStatus(searchParams.get("status"));
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  return (
    <>
      <div className="grid gap-4 text-[16px] lg:grid-cols-[280px_1fr]">
        <ProfileSidebar
          activeSection={section}
          onEditProfileClick={() => setIsEditProfileModalOpen(true)}
          onChangePasswordClick={() => setIsChangePasswordModalOpen(true)}
        />

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-7">
          {section === "orders" ? (
            <>
              <h1 className="font-bold text-slate-900">คำสั่งซื้อของฉัน</h1>
              <div className="mt-4">
                <ProfileStatusTabs section="orders" activeStatus={status} />
              </div>
              <ProfileDataTable columns={orderColumns} emptyText={`ยังไม่มีรายการคำสั่งซื้อในสถานะ: ${statusText[status]}`} />
            </>
          ) : null}

          {section === "address" ? (
            <>
              <h1 className="font-bold text-slate-900">ที่อยู่</h1>
              <ProfileDataTable
                columns={addressColumns}
                emptyText="No available options"
                topAction={
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-400 sm:w-auto"
                  >
                    <PlusIcon className="h-5 w-5" />
                    เพิ่มที่อยู่ใหม่
                  </button>
                }
              />
            </>
          ) : null}

          {section === "repair" ? (
            <>
              <h1 className="font-bold text-slate-900">แจ้งซ่อม</h1>
              <div className="mt-4">
                <ProfileStatusTabs section="repair" activeStatus={status} />
              </div>
              <ProfileDataTable columns={repairColumns} emptyText="ไม่มีรายการแจ้งซ่อม" />
            </>
          ) : null}
        </section>
      </div>

      <AddAddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
}
