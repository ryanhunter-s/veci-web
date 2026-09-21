"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { getWorker, reviewsForWorker } from "@/lib/workers-store";
import { categories } from "@/utils/data";
import {
  formatWorkerRate,
  modalityRateLabel,
  trustChecks,
  trustLevel,
  trustScore,
  workerStatusStyles,
} from "@/utils/workers";
import { jobModalityStyles } from "@/utils/jobs";
import ContactPanel from "./ContactPanel";

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const worker = useMemo(() => getWorker(id), [id]);
  const reviews = useMemo(() => (worker ? reviewsForWorker(worker.id) : []), [worker]);
  const [showContact, setShowContact] = useState(false);

  if (!worker) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">😕</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Worker not found</h1>
        <p className="mt-2 text-muted">The profile may have been removed.</p>
        <Link
          href="/workers"
          className="mt-4 inline-block text-primary hover:text-primary-hover font-medium"
        >
          &larr; Back to workers
        </Link>
      </div>
    );
  }

  const status = workerStatusStyles[worker.status];
  const score = trustScore(worker, reviews.length);
  const level = trustLevel(score);
  const checks = trustChecks(worker, reviews.length);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/workers" className="text-sm text-muted hover:text-foreground transition-colors">
        &larr; Back to workers
      </Link>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={worker.name} photo={worker.photo} size={64} />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                  {worker.name}
                </h1>
                {worker.verified && (
                  <span title="Verified phone and email">✔️</span>
                )}
              </div>
              <p className="text-sm text-muted">{worker.title}</p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Rating + trust */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            ★ {worker.rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted">
            {worker.completedJobs} completed job{worker.completedJobs !== 1 ? "s" : ""}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${level.chip}`}
          >
            🛡️ {score}/100 · {level.label}
          </span>
        </div>

        <p className="mt-6 whitespace-pre-line text-foreground leading-relaxed">{worker.bio}</p>

        {/* Services */}
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">What they offer</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {worker.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? (
                <span
                  key={catId}
                  className="rounded-full bg-muted-light px-3 py-1 text-sm text-muted"
                >
                  {cat.icon} {cat.label}
                </span>
              ) : null;
            })}
          </div>

          <h4 className="mt-5 text-sm font-medium text-muted">Payment modalities</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {worker.modalities.map((m) => (
              <span
                key={m}
                className={`rounded-full px-3 py-1 text-sm font-medium ${jobModalityStyles[m]}`}
              >
                {modalityRateLabel(m)}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">Details</h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">Rate</dt>
              <dd className="font-semibold text-foreground">{formatWorkerRate(worker)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">Negotiable</dt>
              <dd className="font-medium text-foreground">{worker.negotiable ? "Yes" : "No"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">Zone</dt>
              <dd className="font-medium text-foreground">📍 {worker.zone}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">City</dt>
              <dd className="font-medium text-foreground">{worker.city}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">Availability</dt>
              <dd className="text-right font-medium text-foreground">{worker.availability}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">Experience</dt>
              <dd className="text-right font-medium text-foreground">{worker.experience}</dd>
            </div>
          </dl>
        </div>

        {/* Verification & trust */}
        <div className="mt-6 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-foreground">Verification &amp; trust</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${level.chip}`}
            >
              🛡️ {score}/100 · {level.label}
            </span>
          </div>

          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted-light">
              <div
                className={`h-full rounded-full ${level.bar} transition-all`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-muted">{score} / 100</p>
          </div>

          <ul className="mt-4 space-y-2.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    c.ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {c.ok ? "✓" : "✗"}
                </span>
                <span className="text-sm">
                  <span className="font-medium text-foreground">{c.label}</span>
                  <span className="text-muted"> — {c.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl bg-muted-light p-4 text-sm text-muted">
            <span className="font-medium text-foreground">
              How do we know {worker.name.split(" ")[0]} is a good worker?
            </span>{" "}
            Identity and contact are verified at sign-up. Ratings and reviews only appear once a
            job is marked completed on Veci — so they reflect real, finished work. The trust score
            combines identity checks (30%), verified ratings (40%), reviews (15%) and completed
            job record (15%).
          </div>
        </div>

        {/* Location notice */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-2">
            <span>🔒</span>
            <p className="text-sm text-muted">
              <span className="font-medium text-foreground">Privacy first.</span> The exact
              location is shared only after you and {worker.name.split(" ")[0]} agree on the
              details.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 border-t border-border pt-6">
          {!showContact ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowContact(true)}
                className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Contact {worker.name.split(" ")[0]}
              </button>
              <p className="text-center text-xs text-muted">
                Free to message. No personal data is shared until you both agree.
              </p>
            </div>
          ) : (
            <ContactPanel worker={worker} />
          )}
        </div>

        {/* Reviews */}
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">
            Reviews ({reviews.length})
          </h3>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              No reviews yet for this worker.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl bg-muted-light p-4">
                  <div className="flex items-center gap-2">
                    <span>{r.reviewerAvatar}</span>
                    <span className="text-sm font-medium text-foreground">
                      {r.reviewerName}
                    </span>
                    <span className="text-xs text-muted">
                      · {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
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
          )}
        </div>
      </div>
    </div>
  );
}