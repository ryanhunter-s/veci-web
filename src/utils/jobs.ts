import type { JobListing, JobListingStatus, JobModality } from "@/types";

export const jobModalities: {
  id: JobModality;
  label: string;
  short: string;
  example: string;
}[] = [
  { id: "por_hora", label: "Per hour", short: "Hourly", example: "e.g. Q35 per hour for 4 hours" },
  { id: "por_dia", label: "Per day", short: "Daily", example: "e.g. Q200 per day for 3 days" },
  { id: "por_semana", label: "Per week", short: "Weekly", example: "e.g. Q1,200 for one week" },
  { id: "recurrente", label: "Recurring", short: "Recurring", example: "e.g. cleaning every Saturday" },
  { id: "por_proyecto", label: "Project", short: "Project", example: "e.g. Q300 to fix a door" },
];

export const jobModalityStyles: Record<JobModality, string> = {
  por_hora: "bg-sky-100 text-sky-700",
  por_dia: "bg-violet-100 text-violet-700",
  por_semana: "bg-emerald-100 text-emerald-700",
  recurrente: "bg-rose-100 text-rose-700",
  por_proyecto: "bg-amber-100 text-amber-700",
};

export const jobListingStatusStyles: Record<
  JobListingStatus,
  { label: string; color: string; dot: string }
> = {
  publicado: { label: "Open", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  contratado: { label: "Hired", color: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  en_progreso: { label: "In progress", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  completado: { label: "Completed", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  cancelado: { label: "Canceled", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export function money(amount: number): string {
  return `Q${amount.toLocaleString("en-US")}`;
}

export function modalityLabel(modality: JobModality): string {
  return jobModalities.find((m) => m.id === modality)?.label ?? modality;
}

export function formatJobPayment(listing: JobListing): string {
  const base = money(listing.amount);
  switch (listing.modality) {
    case "por_hora":
      return listing.units ? `${base}/hour · ${listing.units} hour${listing.units > 1 ? "s" : ""}` : `${base}/hour`;
    case "por_dia":
      return listing.units ? `${base}/day · ${listing.units} day${listing.units > 1 ? "s" : ""}` : `${base}/day`;
    case "por_semana":
      return listing.units ? `${base}/week · ${listing.units} week${listing.units > 1 ? "s" : ""}` : `${base}/week`;
    case "recurrente":
      return `${base}/visit`;
    case "por_proyecto":
      return `${base} total`;
  }
}

export function formatJobPaymentShort(listing: JobListing): string {
  const base = money(listing.amount);
  switch (listing.modality) {
    case "por_hora":
      return `${base}/hour`;
    case "por_dia":
      return `${base}/day`;
    case "por_semana":
      return `${base}/week`;
    case "recurrente":
      return `${base}/visit`;
    case "por_proyecto":
      return `${base}`;
  }
}

export function formatJobDates(listing: JobListing): string {
  const start = new Date(`${listing.startDate}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  if (!listing.endDate) return start;
  const end = new Date(`${listing.endDate}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return `${start} – ${end}`;
}

export function formatJobDuration(listing: JobListing): string {
  if (listing.modality === "recurrente") {
    return listing.frequency ? `${listing.frequency}` : "Recurring";
  }
  if (listing.units && (listing.modality === "por_hora" || listing.modality === "por_dia")) {
    return `${listing.units} ${listing.modality === "por_hora" ? "hour" : "day"}${listing.units > 1 ? "s" : ""}`;
  }
  if (listing.modality === "por_semana") {
    return listing.units ? `${listing.units} week${listing.units > 1 ? "s" : ""}` : "1 week";
  }
  return "One-time";
}

export function normalizeLocation(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isNearbyLocation(userLocation: string, zone: string, city = ""): boolean {
  const a = normalizeLocation(userLocation || "");
  const b = normalizeLocation(`${zone} ${city}`);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  const tokensA = new Set(a.split(" ").filter((t) => t.length > 1 && t !== "zona"));
  const tokensB = b.split(" ").filter((t) => t.length > 1);
  return tokensB.some((t) => tokensA.has(t));
}