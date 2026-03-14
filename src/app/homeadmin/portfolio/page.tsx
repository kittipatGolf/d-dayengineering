"use client";

import { useEffect, useMemo, useState } from "react";
import { portfolioService } from "@/lib/services/portfolio.service";
import { emptyPortfolioForm } from "./component/form-defaults";
import { PortfolioCard } from "./component/portfolio-card";
import { PortfolioFormModal } from "./component/portfolio-form-modal";
import { PortfolioToolbar } from "./component/portfolio-toolbar";
import type { PortfolioFormState, PortfolioItem } from "./component/types";

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioFormState>(emptyPortfolioForm);

  useEffect(() => {
    portfolioService.getAll().then(setItems).catch(() => setItems([]));
  }, []);

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
      images: target.image
        ? [
            {
              id: `${target.id}-cover`,
              url: target.image,
              name: "cover",
              size: 0,
              mimeType: "image/*",
            },
          ]
        : [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await portfolioService.remove(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    const title = form.title.trim();
    const description = form.description.trim();
    const image = form.images[0]?.url ?? "";

    if (!title || !description || !image) return;

    if (editingId) {
      const updated = await portfolioService.update(editingId, { title, description, image });
      setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      closeModal();
      return;
    }

    const created = await portfolioService.create({ title, description, image });
    setItems((prev) => [created, ...prev]);
    closeModal();
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">การจัดการผลงาน</h1>
        <p className="mt-1 text-sm text-blue-100">เพิ่ม แก้ไข และจัดเรียงผลงานให้ดูเป็นระบบ</p>
      </header>

      <PortfolioToolbar query={query} onQueryChange={setQuery} onAdd={openCreate} />

      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        onSubmit={handleSubmit}
      />
    </div>
  );
}
