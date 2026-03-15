"use client";

import { useEffect, useMemo, useState } from "react";
import { usersService } from "@/lib/services/users.service";
import { UserAddressEditModal } from "./component/user-address-edit-modal";
import { UserAddressesModal } from "./component/user-addresses-modal";
import { UserEditModal } from "./component/user-edit-modal";
import { UsersTable } from "./component/users-table";
import { SuccessToast } from "@/components/success-toast";
import type { AdminUser, UserAddress, UserRole } from "./component/types";

type UserEditState = {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: UserRole;
};

const EMPTY_EDIT_STATE: UserEditState = {
  username: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  role: "User",
};

type AddressEditState = {
  line: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
};

const EMPTY_ADDRESS_EDIT_STATE: AddressEditState = {
  line: "",
  province: "",
  district: "",
  subdistrict: "",
  postalCode: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [keyword, setKeyword] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedUserForAddress, setSelectedUserForAddress] = useState<AdminUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UserEditState>(EMPTY_EDIT_STATE);
  const [addressEditModalOpen, setAddressEditModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressEditState>(EMPTY_ADDRESS_EDIT_STATE);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    usersService.getAll().then(setUsers).catch(() => setUsers([]));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) =>
      [
        user.id,
        user.username,
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        ...user.addresses.map(
          (address) =>
            `${address.line} ${address.subdistrict} ${address.district} ${address.province} ${address.postalCode}`,
        ),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [users, keyword]);

  const openAddressModal = (user: AdminUser) => {
    setSelectedUserForAddress(user);
    setAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    closeAddressEditModal();
    setAddressModalOpen(false);
    setSelectedUserForAddress(null);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUserId(user.id);
    setEditForm({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingUserId(null);
    setEditForm(EMPTY_EDIT_STATE);
  };

  const saveEdit = async () => {
    if (!editingUserId) return;
    const updated = await usersService.update(editingUserId, editForm);
    setUsers((prev) => prev.map((item) => (item.id === editingUserId ? updated : item)));
    closeEditModal();
    setToast("แก้ไขข้อมูลผู้ใช้สำเร็จ");
  };

  const deleteUser = async (id: string) => {
    await usersService.remove(id);
    setUsers((prev) => prev.filter((item) => item.id !== id));
    setToast("ลบผู้ใช้สำเร็จ");
  };

  const openAddressEditModal = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setAddressForm({
      line: address.line,
      province: address.province,
      district: address.district,
      subdistrict: address.subdistrict,
      postalCode: address.postalCode,
    });
    setAddressEditModalOpen(true);
  };

  const closeAddressEditModal = () => {
    setAddressEditModalOpen(false);
    setEditingAddressId(null);
    setAddressForm(EMPTY_ADDRESS_EDIT_STATE);
  };

  const saveAddressEdit = async () => {
    if (!selectedUserForAddress || !editingAddressId) return;

    const nextAddresses = selectedUserForAddress.addresses.map((address) =>
      address.id === editingAddressId ? { ...address, ...addressForm } : address,
    );

    const updatedUser = await usersService.updateAddresses(selectedUserForAddress.id, nextAddresses);

    setUsers((prev) => prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)));
    setSelectedUserForAddress(updatedUser);
    closeAddressEditModal();
    setToast("แก้ไขที่อยู่สำเร็จ");
  };

  const deleteAddress = async (addressId: string) => {
    if (!selectedUserForAddress) return;
    const nextAddresses = selectedUserForAddress.addresses.filter((address) => address.id !== addressId);
    const updatedUser = await usersService.updateAddresses(selectedUserForAddress.id, nextAddresses);
    setUsers((prev) => prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)));
    setSelectedUserForAddress(updatedUser);
    setToast("ลบที่อยู่สำเร็จ");
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">จัดการสมาชิก</h1>
          <p className="mt-1 text-sm text-blue-200/80">ดูข้อมูล แก้ไข และจัดการที่อยู่ของสมาชิกทั้งหมดในระบบ</p>
        </div>
      </header>

      <UsersTable
        rows={filteredUsers}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onViewAddresses={openAddressModal}
        onEdit={openEditModal}
        onDelete={deleteUser}
      />

      <UserAddressesModal
        open={addressModalOpen}
        user={selectedUserForAddress}
        onClose={closeAddressModal}
        onEditAddress={openAddressEditModal}
        onDeleteAddress={deleteAddress}
      />
      <UserAddressEditModal
        open={addressEditModalOpen}
        form={addressForm}
        onClose={closeAddressEditModal}
        onFormChange={setAddressForm}
        onSubmit={saveAddressEdit}
      />
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <UserEditModal
        open={editModalOpen}
        form={editForm}
        onClose={closeEditModal}
        onFormChange={setEditForm}
        onSubmit={saveEdit}
      />
    </div>
  );
}
