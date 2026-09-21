import Link from "next/link";
import type { JobListing } from "@/types";
import { categories } from "@/utils/data";
import {
  formatJobDates,
  formatJobDuration,
  formatJobPaymentShort,
  jobListingStatusStyles,
  jobModalityStyles,
} from "@/utils/jobs";

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

export default function JobListingCard({ listing }: { listing: JobListing }) {
  const cat = categories.find((c) => c.id === listing.category);
  const status = jobListingStatusStyles[listing.status];
  const applicants = listing.status === "publicado" && listing.applicationsCount > 0;

  return (
    <Link
      href={`/jobs/${listing.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="text-2xl">{cat?.icon}</span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight text-(--color-abyss) transition-colors group-hover:text-primary line-clamp-1">
              {listing.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
              <span>📍</span>
              <span className="line-clamp-1">
                {listing.zone} · {listing.city}
              </span>
            </p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${jobModalityStyles[listing.modality]}`}>
          {modalityShort(listing.modality)}
        </span>
        <span className="rounded-full bg-muted-light px-2.5 py-1">{cat?.label}</span>
        <span className="flex items-center gap-1">
          <span>📅</span>
          {formatJobDates(listing)}
        </span>
        <span className="flex items-center gap-1">
          <span>🕒</span>
          <span className="line-clamp-1">{listing.schedule}</span>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="text-lg font-bold text-foreground">{formatJobPaymentShort(listing)}</p>
          <p className="mt-0.5 text-xs text-muted">{formatJobDuration(listing)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-base">
          <span>{listing.publisher.avatar}</span>
          {listing.publisherVerified && <span title="Verified profile">✔️</span>}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span>
            {applicants
              ? `${listing.applicationsCount} applicant${listing.applicationsCount > 1 ? "s" : ""}`
              : listing.status === "publicado"
                ? "Be the first to apply"
                : `${listing.peopleNeeded} spot${listing.peopleNeeded > 1 ? "s" : ""}`}
          </span>
          <span>·</span>
          <span>{timeAgo(listing.createdAt)}</span>
        </span>
        <span className="font-medium text-primary transition-colors group-hover:underline">
          View job &rarr;
        </span>
      </div>
    </Link>
  );
}

function modalityShort(modality: JobListing["modality"]): string {
  switch (modality) {
    case "por_hora":
      return "⏱️ Per hour";
    case "por_dia":
      return "Per day";
    case "por_semana":
      return "Per week";
    case "recurrente":
      return "🔁 Recurring";
    case "por_proyecto":
      return "Project";
  }
}