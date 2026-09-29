"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import JobListingCard from "@/components/JobListingCard";
import { categories } from "@/utils/data";
import { getAllListings } from "@/lib/jobs-store";
import { isNearbyLocation, jobModalities } from "@/utils/jobs";
import type { Category, JobModality } from "@/types";

function JobsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const initialModality = searchParams.get("modality") as JobModality | null;

  const { data: session } = useSession();
  const userLocation = [session?.user?.neighborhood, session?.user?.address]
    .filter(Boolean)
    .join(" ");

  const [activeCategory, setActiveCategory] = useState<Category | "all">(
    initialCategory && categories.some((c) => c.id === initialCategory) ? initialCategory : "all"
  );
  const [activeModality, setActiveModality] = useState<JobModality | "all">(
    initialModality && jobModalities.some((m) => m.id === initialModality) ? initialModality : "all"
  );
  const [search, setSearch] = useState("");
  const [nearMeOnly, setNearMeOnly] = useState(false);

  const listings = useMemo(() => getAllListings(), []);

  const filtered = listings
    .filter((l) => {
      if (l.status === "cancelado") return false;
      if (activeModality !== "all" && l.modality !== activeModality) return false;
      if (activeCategory !== "all" && l.category !== activeCategory) return false;
      if (
        search &&
        !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .map((listing) => ({
      listing,
      nearby: userLocation.trim().length > 0 && isNearbyLocation(userLocation, listing.zone, listing.city),
    }))
    .filter((entry) => !nearMeOnly || entry.nearby)
    .sort((a, b) => Number(b.nearby) - Number(a.nearby));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs near you</h1>
          <p className="mt-1 text-muted">
            Paid work close to home — per hour, per day, per week or per project.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/jobs/new"
            className="rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            + Post a job
          </Link>
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveModality("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeModality === "all"
              ? "bg-primary text-white"
              : "bg-muted-light text-muted hover:bg-border"
          }`}
        >
          All
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
        {userLocation.trim().length > 0 && (
          <button
            onClick={() => setNearMeOnly((v) => !v)}
            className={`ml-auto shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              nearMeOnly
                ? "bg-accent text-white"
                : "border border-border bg-card text-muted hover:bg-card-hover"
            }`}
          >
            📍 Cerca de mí
          </button>
        )}
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
        {filtered.map(({ listing, nearby }) => (
          <JobListingCard key={listing.id} listing={listing} nearby={nearby} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-2 text-lg font-medium text-foreground">No jobs found</p>
          <p className="mt-1 text-sm text-muted">
            {nearMeOnly
              ? `No open jobs near ${userLocation}. Try a different filter or update your address in Settings.`
              : "Try a different modality, category or search term."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Jobs near you</h1>
              <p className="mt-1 text-muted">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}