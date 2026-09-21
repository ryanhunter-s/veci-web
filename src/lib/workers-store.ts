import type { WorkerContact, WorkerProfile } from "@/types";
import { mockWorkers, mockWorkerReviews } from "@/utils/data";

const WORKERS_KEY = "veci.worker.profiles";
const CONTACTS_KEY = "veci.worker.contacts";

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

export function getAllWorkers(): WorkerProfile[] {
  const stored = read<WorkerProfile[]>(WORKERS_KEY, []);
  const storedById = new Map(stored.map((w) => [w.id, w]));
  return mockWorkers
    .map((w) => storedById.get(w.id) ?? w)
    .concat(stored.filter((w) => !mockWorkers.some((m) => m.id === w.id)));
}

export function getWorker(id: string): WorkerProfile | undefined {
  return getAllWorkers().find((w) => w.id === id);
}

export function registerWorker(worker: WorkerProfile): void {
  const stored = read<WorkerProfile[]>(WORKERS_KEY, []);
  write(WORKERS_KEY, [...stored, worker]);
}

export function reviewsForWorker(workerId: string): (typeof mockWorkerReviews)[number][] {
  return mockWorkerReviews.filter((r) => r.workerId === workerId);
}

export function sendContact(contact: WorkerContact): void {
  const stored = read<WorkerContact[]>(CONTACTS_KEY, []);
  write(CONTACTS_KEY, [contact, ...stored]);
}

export function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}