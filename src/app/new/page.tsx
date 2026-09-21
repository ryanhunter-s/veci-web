"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/utils/data";

export default function NewRequestPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/explore"), 2000);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Request published!</h1>
        <p className="mt-2 text-muted">Your neighbors will be able to see you and respond soon. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Ask for help</h1>
      <p className="mt-1 text-muted">Describe what you need and your community will help.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="What do you need?"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            required
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={5}
            placeholder="Tell us more details about what you need..."
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            placeholder="e.g. Centro, 5 de Mayo street"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-foreground">
            Your name
          </label>
          <input
            id="author"
            type="text"
            required
            placeholder="What's your name?"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Publish request
        </button>
      </form>
    </div>
  );
}
