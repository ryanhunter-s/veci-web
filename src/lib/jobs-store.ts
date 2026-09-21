import type { JobApplication, JobListing } from "@/types";
import { mockJobListings, mockApplications } from "@/utils/data";

const LISTINGS_KEY = "veci.job.listings";
const APPLICATIONS_KEY = "veci.job.applications";
const APPLIED_KEY = "veci.job.applied";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
}

export function getAllListings(): JobListing[] {
  const stored = read<JobListing[]>(LISTINGS_KEY, []);
  const storedById = new Map(stored.map((l) => [l.id, l]));
  return mockJobListings.map((l) => storedById.get(l.id) ?? l).concat(stored.filter((l) => !mockJobListings.some((m) => m.id === l.id)));
}

export function getListing(id: string): JobListing | undefined {
  return getAllListings().find((l) => l.id === id);
}

export function publishListing(listing: JobListing): void {
  const stored = read<JobListing[]>(LISTINGS_KEY, []);
  write(LISTINGS_KEY, [listing, ...stored]);
}

export function getAllApplications(): JobApplication[] {
  const stored = read<JobApplication[]>(APPLICATIONS_KEY, []);
  return [...mockApplications, ...stored];
}

export function applicationsForJob(jobId: string): JobApplication[] {
  return getAllApplications().filter((a) => a.jobId === jobId);
}

export function addApplication(application: JobApplication): void {
  const stored = read<JobApplication[]>(APPLICATIONS_KEY, []);
  write(APPLICATIONS_KEY, [application, ...stored]);
}

export function hasApplied(jobId: string): boolean {
  return read<string[]>(APPLIED_KEY, []).includes(jobId);
}

export function markApplied(jobId: string): void {
  const stored = read<string[]>(APPLIED_KEY, []);
  if (!stored.includes(jobId)) write(APPLIED_KEY, [jobId, ...stored]);
}

export function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}