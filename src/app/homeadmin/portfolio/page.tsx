"use client";

import { useMemo, useState } from "react";
import { emptyPortfolioForm, initialPortfolioItems } from "./component/mock-data";
import { PortfolioCard } from "./component/portfolio-card";
import { PortfolioFormModal } from "./component/portfolio-form-modal";
import { PortfolioToolbar } from "./component/portfolio-toolbar";
import type { PortfolioFormState, PortfolioItem } from "./component/types";

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioFormState>(emptyPortfolioForm);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [items, query]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyPortfolioForm);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setEditingId(id);
    setForm({
      title: target.title,
      description: target.description,
      images: target.image ? [target.image] : [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handlePickImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    const title = form.title.trim();
    const description = form.description.trim();
    const image = form.images[0] ?? "";

    if (!title || !description || !image) return;

    const updatedAt = new Date().toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                description,
                image,
                updatedAt,
              }
            : item,
        ),
      );
      closeModal();
      return;
    }

    setItems((prev) => [
      {
        id: `PF-${String(prev.length + 1).padStart(3, "0")}`,
        title,
        description,
        image,
        updatedAt,
      },
      ...prev,
    ]);
    closeModal();
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">การจัดการผลงาน</h1>
        <p className="mt-1 text-sm text-blue-100">เพิ่ม แก้ไข และจัดเรียงผลงานให้ดูเป็นระบบ</p>
      </header>

      <PortfolioToolbar query={query} onQueryChange={setQuery} onAdd={openCreate} />

      <section className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </section>

      <div className="mt-5 text-sm text-slate-500">
        Showing 1 - {filteredItems.length} of {filteredItems.length}
      </div>

      <PortfolioFormModal
        open={modalOpen}
        editing={Boolean(editingId)}
        form={form}
        onClose={closeModal}
        onFormChange={setForm}
        onPickImages={handlePickImages}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
