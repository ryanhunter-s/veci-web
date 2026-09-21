import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { WorkerProfile } from "@/types";
import { categories } from "@/utils/data";
import { reviewsForWorker } from "@/lib/workers-store";
import {
  formatWorkerRate,
  trustChecks,
  trustLevel,
  trustScore,
  workerStatusStyles,
} from "@/utils/workers";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function WorkerCard({ worker }: { worker: WorkerProfile }) {
  const status = workerStatusStyles[worker.status];
  const reviews = reviewsForWorker(worker.id).length;
  const score = trustScore(worker, reviews);
  const level = trustLevel(score);

  return (
    <Link
      href={`/workers/${worker.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={worker.name} photo={worker.photo} size={48} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold leading-tight text-(--color-abyss) line-clamp-1">
                {worker.name}
              </h3>
              {worker.verified && <span title="Verified profile">✔️</span>}
            </div>
            <p className="mt-0.5 text-sm text-muted line-clamp-1">{worker.title}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted line-clamp-2">{worker.bio}</p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        {worker.categories.slice(0, 3).map((catId) => {
          const cat = categories.find((c) => c.id === catId);
          return cat ? (
            <span key={catId} className="rounded-full bg-muted-light px-2.5 py-1 text-muted">
              {cat.icon} {cat.label}
            </span>
          ) : null;
        })}
        <span className="rounded-full bg-primary-light px-2.5 py-1 font-medium text-primary">
          {formatWorkerRate(worker)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <span className="text-amber-500">★</span> {worker.rating.toFixed(1)}
            <span className="font-normal text-muted">({worker.completedJobs})</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <span>📍</span>
            <span className="line-clamp-1">
              {worker.zone} · {worker.city}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted">
          <span>🕒 {worker.availability}</span>
          <span>{timeAgo(worker.createdAt)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${level.chip}`}
          title={`Trust score ${score}/100 — ${level.label}. ${trustChecks(worker, reviews)
            .map((c) => `${c.ok ? "✓" : "✗"} ${c.label}`)
            .join(" · ")}`}
        >
          🛡️ {score}/100 · {level.label}
        </span>
        <span className="text-sm font-medium text-primary transition-colors group-hover:underline">
          View profile &rarr;
        </span>
      </div>
    </Link>
  );
}