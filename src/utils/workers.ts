import type { JobModality, WorkerProfile, WorkerStatus } from "@/types";
import { money } from "@/utils/jobs";

export const workerStatusStyles: Record<WorkerStatus, { label: string; color: string; dot: string }> = {
  disponible: { label: "Available", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  ocupado: { label: "Busy", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

export function formatWorkerRate(worker: Pick<WorkerProfile, "rate" | "rateModality">): string {
  const base = money(worker.rate);
  switch (worker.rateModality) {
    case "por_hora":
      return `${base}/hour`;
    case "por_dia":
      return `${base}/day`;
    case "por_semana":
      return `${base}/week`;
    case "recurrente":
      return `${base}/visit`;
    case "por_proyecto":
      return `${base}/project`;
  }
}

export function modalityRateLabel(modality: JobModality): string {
  switch (modality) {
    case "por_hora":
      return "Per hour";
    case "por_dia":
      return "Per day";
    case "por_semana":
      return "Per week";
    case "recurrente":
      return "Per visit";
    case "por_proyecto":
      return "Per project";
  }
}

export function avatarHue(name: string): number {
  let hue = 0;
  for (let i = 0; i < name.length; i += 1) {
    hue = (hue * 31 + name.charCodeAt(i)) % 360;
  }
  return hue;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((p) => (p[0] ?? "").toUpperCase()).join("");
  return initials || "?";
}

export interface TrustCheck {
  label: string;
  detail: string;
  ok: boolean;
}

export function trustChecks(worker: WorkerProfile, reviewCount: number): TrustCheck[] {
  return [
    {
      label: "ID verified",
      detail: "Identity checked against an official document.",
      ok: worker.verified,
    },
    {
      label: "Phone & email verified",
      detail: "Contact details confirmed at sign-up.",
      ok: worker.verified,
    },
    {
      label: "Rating from completed jobs",
      detail: "Reviews are published only after a job is marked as completed.",
      ok: worker.rating > 0 && reviewCount > 0,
    },
    {
      label: "Track record",
      detail: `${worker.completedJobs} completed job${worker.completedJobs !== 1 ? "s" : ""} closed on Veci.`,
      ok: worker.completedJobs > 0,
    },
  ];
}

export function trustScore(worker: WorkerProfile, reviewCount: number): number {
  const id = worker.verified ? 20 : 0;
  const contact = worker.verified ? 10 : 0;
  const rating = (Math.min(worker.rating, 5) / 5) * 40;
  const reviews = (Math.min(reviewCount, 5) / 5) * 15;
  const record = (Math.min(worker.completedJobs, 25) / 25) * 15;
  return Math.round(id + contact + rating + reviews + record);
}

export interface TrustLevel {
  label: string;
  chip: string;
  bar: string;
}

export function trustLevel(score: number): TrustLevel {
  if (score >= 80) {
    return {
      label: "Confirmed",
      chip: "bg-green-100 text-green-700",
      bar: "bg-green-500",
    };
  }
  if (score >= 60) {
    return {
      label: "Reliable",
      chip: "bg-blue-100 text-blue-700",
      bar: "bg-blue-500",
    };
  }
  if (score >= 40) {
    return {
      label: "Getting started",
      chip: "bg-amber-100 text-amber-700",
      bar: "bg-amber-500",
    };
  }
  return {
    label: "New profile",
    chip: "bg-gray-100 text-gray-600",
    bar: "bg-gray-400",
  };
}