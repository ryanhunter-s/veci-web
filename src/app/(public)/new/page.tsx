"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewRequestPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/jobs/new");
  }, [router]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Post a gig</h1>
      <p className="mt-1 text-muted">Go to the new gig form to publish a paid gig.</p>

      <div className="mt-8">
        <a
          href="/jobs/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Post a gig
        </a>
      </div>
    </div>
  );
}
