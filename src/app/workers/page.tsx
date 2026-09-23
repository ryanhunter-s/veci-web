"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WorkerCard from "@/components/WorkerCard";
import { categories } from "@/utils/data";
import { getAllWorkers } from "@/lib/workers-store";
import { jobModalities } from "@/utils/jobs";
import type { Category, JobModality, WorkerStatus } from "@/types";

function WorkersContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;

  const [activeCategory, setActiveCategory] = useState<Category | "all">(
    initialCategory && categories.some((c) => c.id === initialCategory) ? initialCategory : "all"
  );
  const [activeModality, setActiveModality] = useState<JobModality | "all">("all");
  const [availability, setAvailability] = useState<WorkerStatus | "all">("all");
  const [search, setSearch] = useState("");

  const workers = useMemo(() => getAllWorkers(), []);

  const filtered = workers.filter((w) => {
    if (availability !== "all" && w.status !== availability) return false;
    if (activeModality !== "all" && !w.modalities.includes(activeModality)) return false;
    if (activeCategory !== "all" && !w.categories.includes(activeCategory)) return false;
    if (
      search &&
      !w.name.toLowerCase().includes(search.toLowerCase()) &&
      !w.title.toLowerCase().includes(search.toLowerCase()) &&
      !w.bio.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-[1400px]  px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workers seeking work</h1>
          <p className="mt-1 text-muted">
            Verified neighbors who offer their skills — nearby, with prices up front.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/workers/new"
            className="rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            + Create my worker profile
          </Link>
          <input
            type="text"
            placeholder="Search workers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setAvailability("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            availability === "all" ? "bg-primary text-white" : "bg-muted-light text-muted hover:bg-border"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setAvailability("disponible")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            availability === "disponible"
              ? "bg-green-600 text-white"
              : "bg-muted-light text-muted hover:bg-border"
          }`}
        >
          ● Available
        </button>
        <button
          onClick={() => setAvailability("ocupado")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            availability === "ocupado"
              ? "bg-gray-700 text-white"
              : "bg-muted-light text-muted hover:bg-border"
          }`}
        >
          Busy
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveModality("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeModality === "all"
              ? "bg-primary text-white"
              : "bg-muted-light text-muted hover:bg-border"
          }`}
        >
          All modalities
        </button>
        {jobModalities.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModality(m.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeModality === m.id
                ? "bg-primary text-white"
                : "bg-muted-light text-muted hover:bg-border"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "border border-primary/40 bg-primary-light text-primary"
              : "border border-border bg-card text-muted hover:bg-card-hover"
          }`}
        >
          All categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "border border-primary/40 bg-primary-light text-primary"
                : "border border-border bg-card text-muted hover:bg-card-hover"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {filtered.map((worker) => ( <WorkerCard key={worker.id} worker={worker} /> ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-2 text-lg font-medium text-foreground">No workers found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different availability, modality, category or search term.
          </p>
        </div>
      )}
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Workers seeking work</h1>
              <p className="mt-1 text-muted">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <WorkersContent />
    </Suspense>
  );
}