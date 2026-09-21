"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getListing, applicationsForJob } from "@/lib/jobs-store";
import { categories, mockReviews } from "@/utils/data";
import {
  formatJobDates,
  formatJobDuration,
  formatJobPayment,
  jobListingStatusStyles,
  jobModalityStyles,
  money,
  modalityLabel,
} from "@/utils/jobs";
import ApplyPanel from "./ApplyPanel";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const listing = useMemo(() => getListing(id), [id]);
  const applications = useMemo(() => (listing ? applicationsForJob(listing.id) : []), [listing]);
  const reviews = useMemo(
    () => (listing ? mockReviews.filter((r) => r.jobId === listing.id) : []),
    [listing]
  );
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const [reported, setReported] = useState(false);

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">😕</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Job not found</h1>
        <p className="mt-2 text-muted">
          It may have been removed or the link is incorrect.
        </p>
        <Link
          href="/jobs"
          className="mt-4 inline-block text-primary hover:text-primary-hover font-medium"
        >
          &larr; Back to jobs
        </Link>
      </div>
    );
  }

  const cat = categories.find((c) => c.id === listing.category);
  const status = jobListingStatusStyles[listing.status];
  const modalityColor = jobModalityStyles[listing.modality];
  const isSelf = session?.user?.name === listing.publisher.name;
  const includes: string[] = [];
  if (listing.includesTransport) includes.push("Transport included");
  if (listing.includesMaterials) includes.push("Materials included");
  if (listing.includesMeals) includes.push("Meals included");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/jobs"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; Back to jobs
      </Link>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{cat?.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {listing.title}
              </h1>
              <p className="mt-1 text-sm text-muted">
                📍 {listing.zone} · {listing.city}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Modality and category */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${modalityColor}`}>
            {modalityLabel(listing.modality)}
          </span>
          <span className="rounded-full bg-muted-light px-2.5 py-1 text-xs font-medium">
            {cat?.label}
          </span>
          <span className="rounded-full bg-muted-light px-2.5 py-1 text-xs font-medium">
            {listing.peopleNeeded} spot{listing.peopleNeeded > 1 ? "s" : ""}
          </span>
          {listing.negotiable && (
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
              ✦ Price negotiable
            </span>
          )}
        </div>

        {/* Payment */}
        <div className="mt-6 rounded-xl bg-muted-light p-4">
          <p className="text-sm font-medium text-muted">Payment</p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {formatJobPayment(listing)}
          </p>
        </div>

        {/* Description */}
        <p className="mt-6 whitespace-pre-line text-foreground leading-relaxed">
          {listing.description}
        </p>

        {/* Conditions */}
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">Conditions & details</h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Row label="Schedule" value={listing.schedule} />
            <Row label="Start date" value={formatJobDates(listing)} />
            {listing.endDate && <Row label="End date" value={new Date(`${listing.endDate}T00:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} />}
            <Row label="Duration" value={formatJobDuration(listing)} />
            <Row label="Spots" value={`${listing.peopleNeeded} person${listing.peopleNeeded > 1 ? "s" : ""}`} />
            <Row label="Payment" value={money(listing.amount)} />
            <Row label="Negotiable" value={listing.negotiable ? "Yes" : "No"} />
            {listing.frequency && <Row label="Frequency" value={listing.frequency} />}
          </dl>
          {listing.requirements && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted">Requirements</p>
              <p className="mt-1 text-sm text-foreground">{listing.requirements}</p>
            </div>
          )}
        </div>

        {/* Includes */}
        {includes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted">This job includes</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {includes.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                >
                  ✅ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location notice */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-2">
            <span>🔒</span>
            <div className="text-sm text-muted">
              <p className="font-medium text-foreground">Approximate zone</p>
              <p className="mt-0.5">
                The exact address is shared once your application is accepted and both
                parties agree on the details.
              </p>
            </div>
          </div>
        </div>

        {/* Agreed conditions */}
        {listing.status !== "publicado" && listing.status !== "cancelado" && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary">Agreed conditions</p>
            <p className="mt-1 text-xs text-muted">
              Both parties confirmed: {formatJobPayment(listing)} · {listing.schedule} · {formatJobDates(listing)} · {listing.zone}.
            </p>
          </div>
        )}

        {/* Publisher card */}
        <div className="mt-6 rounded-xl bg-muted-light p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-xl">
              {listing.publisher.avatar}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{listing.publisher.name}</p>
              <p className="flex items-center gap-1.5 text-sm text-muted">
                {listing.publisherVerified && (
                  <span title="Verified phone and email">✔️ Verified profile</span>
                )}
                {!listing.publisherVerified && "Member of your neighborhood"}
              </p>
            </div>
            {avgRating && (
              <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                ★ {avgRating} ({reviews.length})
              </span>
            )}
          </div>
        </div>

        {/* Applications count */}
        <div className="mt-6 flex items-center justify-between text-sm text-muted">
          <span>
            {listing.applicationsCount + applications.length} applicant
            {listing.applicationsCount + applications.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground">
              Reviews ({reviews.length})
            </h3>
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl bg-muted-light p-4">
                  <div className="flex items-center gap-2">
                    <span>{r.reviewerAvatar}</span>
                    <span className="text-sm font-medium text-foreground">
                      {r.reviewerName}
                    </span>
                    <span className="text-xs text-muted">
                      · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </span>
                    <span className="ml-auto text-xs text-muted">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply panel */}
        {!isSelf && (
          <div className="mt-6 border-t border-border pt-6">
            <ApplyPanel listing={listing} />
          </div>
        )}
        {isSelf && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center text-sm text-muted">
            This is your job posting.
          </div>
        )}

        {/* Report */}
        <div className="mt-6 border-t border-border pt-6">
          {!reported ? (
            <button
              onClick={() => setReported(true)}
              className="text-xs text-muted hover:text-danger transition-colors"
            >
              🚩 Report this listing
            </button>
          ) : (
            <p className="text-xs text-muted">
              ✔️ Thanks, we&apos;ll review this listing. You can{" "}
              <Link href="/jobs" className="text-primary hover:text-primary-hover">
                go back to jobs
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}