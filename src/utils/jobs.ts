import type { JobListing, JobListingStatus, JobSchedule, PayUnit } from "@/types";

export const payUnits: {
  id: PayUnit;
  label: string;
  short: string;
  per: string;
  example: string;
}[] = [
  { id: "hora", label: "Per hour", short: "Hourly", per: "hour", example: "e.g. Q35 per hour for 4 hours" },
  { id: "dia", label: "Per day", short: "Daily", per: "day", example: "e.g. Q200 per day for 3 days" },
  { id: "semana", label: "Per week", short: "Weekly", per: "week", example: "e.g. Q1,200 for one week" },
  { id: "mes", label: "Per month", short: "Monthly", per: "month", example: "e.g. Q3,500 per month" },
  { id: "proyecto", label: "Per project", short: "Project", per: "project", example: "e.g. Q300 to fix a door" },
];

export const jobSchedules: { id: JobSchedule; label: string; short: string; example: string }[] = [
  { id: "puntual", label: "One-time", short: "One-time", example: "e.g. move a sofa on Saturday" },
  { id: "recurrente", label: "Recurring", short: "Recurring", example: "e.g. cleaning every Saturday" },
];

export const scheduleStyles: Record<JobSchedule, string> = {
  puntual: "bg-slate-100 text-slate-700",
  recurrente: "bg-rose-100 text-rose-700",
};

export const payUnitStyles: Record<PayUnit, string> = {
  hora: "bg-sky-100 text-sky-700",
  dia: "bg-violet-100 text-violet-700",
  semana: "bg-emerald-100 text-emerald-700",
  mes: "bg-indigo-100 text-indigo-700",
  proyecto: "bg-amber-100 text-amber-700",
};

export const jobListingStatusStyles: Record<JobListingStatus, { label: string; color: string; dot: string }> = {
  publicado: { label: "Open", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  contratado: { label: "Hired", color: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  en_progreso: { label: "In progress", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  completado: { label: "Completed", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  cancelado: { label: "Canceled", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export function money(amount: number): string {
  return `Q${amount.toLocaleString("en-US")}`;
}

export function unitLabel(unit: PayUnit): string {
  return payUnits.find((u) => u.id === unit)?.label ?? unit;
}

export function unitShort(unit: PayUnit): string {
  return payUnits.find((u) => u.id === unit)?.short ?? unit;
}

export function scheduleLabel(schedule: JobSchedule): string {
  return jobSchedules.find((s) => s.id === schedule)?.label ?? schedule;
}

export function unitPer(unit: PayUnit): string {
  return payUnits.find((u) => u.id === unit)?.per ?? unit;
}

export function formatJobPayment(listing: JobListing): string {
  const base = money(listing.amount);
  if (listing.unit === "proyecto") return `${base} total`;
  const per = `${base}/${unitPer(listing.unit)}`;
  if (!listing.units) return per;
  return `${per} · ${listing.units} ${unitPer(listing.unit)}${listing.units > 1 ? "s" : ""}`;
}

export function formatJobPaymentShort(listing: JobListing): string {
  const base = money(listing.amount);
  if (listing.unit === "proyecto") return base;
  return `${base}/${unitPer(listing.unit)}`;
}

export function formatJobDates(listing: JobListing): string {
  const start = new Date(`${listing.startDate}T00:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "short" });

  if (!listing.endDate) return start;
  const end = new Date(`${listing.endDate}T00:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "short" });
  return `${start} – ${end}`;
}

export function formatJobDuration(listing: JobListing): string {
  if (listing.schedule === "recurrente") {
    return listing.frequency ? listing.frequency : "Recurring";
  }
  if (listing.units) {
    const per = unitPer(listing.unit);
    return `${listing.units} ${per}${listing.units > 1 ? "s" : ""}`;
  }
  if (listing.unit === "mes") return "1 month";
  if (listing.unit === "semana") return "1 week";
  return "One-time";
}

export function normalizeLocation(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
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