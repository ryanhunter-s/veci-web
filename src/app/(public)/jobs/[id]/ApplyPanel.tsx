"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { JobListing, JobApplication } from "@/types";
import { addApplication, hasApplied, markApplied, newId } from "@/lib/jobs-store";
import { money } from "@/utils/jobs";

export default function ApplyPanel({ listing }: { listing: JobListing }) {
  const { data: session } = useSession();
  const [applied, setApplied] = useState<boolean>(() => hasApplied(listing.id));
  const [presentation, setPresentation] = useState("");
  const [experience, setExperience] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (listing.status !== "publicado") {
    return (
      <p className="rounded-xl bg-muted-light px-4 py-3 text-center text-sm text-muted">
        {listing.status === "contratado"
          ? "🤝 This job has already found its helper."
          : listing.status === "completado"
            ? "✅ This job has been completed."
            : "This job is no longer accepting applications."}
      </p>
    );
  }

  if (applied) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-2xl">🎉</p>
        <p className="mt-1 font-medium text-foreground">Application sent!</p>
        <p className="mt-1 text-sm text-muted">
          The employer will review your application and can reach out to chat before
          confirming the agreement.
        </p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (presentation.trim().length < 10) {
      setError("Write a short introduction of at least 10 characters.");
      return;
    }

    const price = proposedPrice ? Number(proposedPrice) : undefined;
    if (listing.negotiable && price !== undefined && (!Number.isFinite(price) || price <= 0)) {
      setError("Enter a valid proposed price.");
      return;
    }

    setSubmitting(true);
    const application: JobApplication = {
      id: newId("app"),
      jobId: listing.id,
      name: session?.user?.name ?? "Neighbor",
      avatar: "🙂",
      presentation: presentation.trim(),
      experience: experience.trim() || undefined,
      proposedPrice: price,
      verified: Boolean(session?.user),
      createdAt: new Date().toISOString(),
    };
    addApplication(application);
    markApplied(listing.id);
    setApplied(true);
    setSubmitting(false);
  }

  return (
    <div>
      <h3 className="font-semibold text-foreground">Apply for this job</h3>
      <p className="mt-1 text-sm text-muted">
        Send a short introduction. The employer reviews applications and will contact you
        by chat.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="presentation" className="block text-sm font-medium text-foreground">
            Short introduction <span className="text-danger">*</span>
          </label>
          <textarea
            id="presentation"
            required
            rows={4}
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
            placeholder="Introduce yourself, mention your availability and why you're a good fit..."
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-foreground">
            Experience (optional)
          </label>
          <input
            id="experience"
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 2 years helping with removals"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        {listing.negotiable && (
          <div>
            <label htmlFor="proposedPrice" className="block text-sm font-medium text-foreground">
              Your proposed price (optional)
            </label>
            <input
              id="proposedPrice"
              type="number"
              min={1}
              step="any"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              placeholder={`e.g. ${money(listing.amount)}`}
              className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <p className="mt-1 text-xs text-muted">
              This listing offers {money(listing.amount)}. You can propose a different amount.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {submitting ? "Applying..." : "Apply now"}
        </button>
      </form>
    </div>
  );
}