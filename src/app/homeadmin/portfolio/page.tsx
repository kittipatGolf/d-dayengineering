"use client";

import { useEffect, useMemo, useState } from "react";
import { portfolioService } from "@/lib/services/portfolio.service";
import { emptyPortfolioForm } from "./component/form-defaults";
import { PortfolioCard } from "./component/portfolio-card";
import { PortfolioFormModal } from "./component/portfolio-form-modal";
import { PortfolioToolbar } from "./component/portfolio-toolbar";
import { SuccessToast } from "@/components/success-toast";
import type { PortfolioFormState, PortfolioItem } from "./component/types";

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioFormState>(emptyPortfolioForm);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioService.getAll().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
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
      images: target.images ?? [],
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
    setToast("ลบผลงานสำเร็จ");
  };

  const handleSubmit = async () => {
    const title = form.title.trim();
    const description = form.description.trim();
    const images = form.images;

    if (!title || !description || images.length === 0) return;

    if (editingId) {
      const updated = await portfolioService.update(editingId, { title, description, images });
      setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      closeModal();
      setToast("แก้ไขผลงานสำเร็จ");
      return;
    }

    const created = await portfolioService.create({ title, description, images });
    setItems((prev) => [created, ...prev]);
    closeModal();
    setToast("เพิ่มผลงานสำเร็จ");
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">การจัดการผลงาน</h1>
          <p className="mt-1 text-sm text-blue-200/80">เพิ่ม แก้ไข และจัดเรียงผลงานให้ดูเป็นระบบ</p>
        </div>
      </header>

      <PortfolioToolbar query={query} onQueryChange={setQuery} onAdd={openCreate} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </>
      )}

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

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
