import type { JobStatus, CommentStatus } from "@/types";

export const jobStatusStyles: Record<JobStatus, { label: string; color: string; dot: string }> = {
  aceptada: { label: "Aceptada", color: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  en_progreso: { label: "En progreso", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  completada: { label: "Completada", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export const commentStatusStyles: Record<CommentStatus, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-700" },
  oculto: { label: "Oculto", color: "bg-gray-100 text-gray-500" },
};