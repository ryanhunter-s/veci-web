"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import RequestCard from "@/components/RequestCard";
import { categories, mockRequests } from "@/utils/data";
import type { Category } from "@/types";

function ExplorarContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") as Category | null;
  const [activeCategory, setActiveCategory] = useState<Category | "todas">(
    initialCategory && categories.some((c) => c.id === initialCategory)
      ? initialCategory
      : "todas"
  );
  const [search, setSearch] = useState("");

  const filtered = mockRequests.filter((r) => {
    if (activeCategory !== "todas" && r.category !== activeCategory) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Explorar solicitudes</h1>
          <p className="mt-1 text-muted">Encuentra a quien necesita ayuda o ofrece la tuya.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("todas")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "todas"
              ? "bg-primary text-white"
              : "bg-muted-light text-muted hover:bg-border"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-white"
                : "bg-muted-light text-muted hover:bg-border"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-2 text-lg font-medium text-foreground">No se encontraron solicitudes</p>
          <p className="mt-1 text-sm text-muted">Intenta con otra búsqueda o categoría.</p>
        </div>
      )}
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Explorar solicitudes</h1>
              <p className="mt-1 text-muted">Cargando...</p>
            </div>
          </div>
        </div>
      }
    >
      <ExplorarContent />
    </Suspense>
  );
}