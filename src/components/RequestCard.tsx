import Link from "next/link";
import type { HelpRequest, Category } from "@/types";
import { categories } from "@/utils/data";

const categoryColors: Record<Category, string> = {
  repairs: "bg-orange-100 text-orange-700",
  transport: "bg-blue-100 text-blue-700",
  pets: "bg-pink-100 text-pink-700",
  groceries: "bg-green-100 text-green-700",
  services: "bg-purple-100 text-purple-700",
  community: "bg-amber-100 text-amber-700",
};

const statusLabels: Record<string, { text: string; color: string }> = {
  abierta: { text: "Open", color: "bg-green-100 text-green-700" },
  en_progreso: { text: "In progress", color: "bg-yellow-100 text-yellow-700" },
  completada: { text: "Completed", color: "bg-gray-100 text-gray-500" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RequestCard({ request }: { request: HelpRequest }) {
  const cat = categories.find((c) => c.id === request.category);
  const status = statusLabels[request.status];

  return (
    <Link
      href={`/request/${request.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cat?.icon}</span>
          <div>
            <h3 className="font-semibold text-(--color-abyss) group-hover:text-primary transition-colors leading-tight">
              {request.title}
            </h3>
            <p className="mt-0.5 text-sm text-muted">{request.location}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
          {status.text}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted line-clamp-2">{request.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{request.author.avatar}</span>
          <span className="text-sm text-muted">{request.author.name}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className={`rounded-full px-2 py-0.5 ${categoryColors[request.category]}`}>
            {cat?.label}
          </span>
          <span>{request.responses} responses</span>
          <span>{timeAgo(request.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
