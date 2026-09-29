"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { categories } from "@/utils/data";
import { publishListing, newId } from "@/lib/jobs-store";
import { jobModalities, money } from "@/utils/jobs";
import type { Category, JobListing, JobModality } from "@/types";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

export default function NewJobPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [modality, setModality] = useState<JobModality>("por_hora");
  const [units, setUnits] = useState("");
  const [frequency, setFrequency] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [includesTransport, setIncludesTransport] = useState(false);
  const [includesMaterials, setIncludesMaterials] = useState(false);
  const [includesMeals, setIncludesMeals] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "" as Category | "",
    description: "",
    startDate: "",
    endDate: "",
    schedule: "",
    zone: "",
    city: "Ciudad de Guatemala",
    peopleNeeded: "1",
    requirements: "",
  });

  const selectedModality = jobModalities.find((m) => m.id === modality);
  const needUnits = modality === "por_hora" || modality === "por_dia";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }
    const parsedUnits = needUnits ? Number(units) : undefined;
    if (needUnits && (!Number.isFinite(parsedUnits) || !parsedUnits || parsedUnits <= 0)) {
      setError("Enter the number of hours or days.");
      return;
    }
    if (modality === "recurrente" && !frequency.trim()) {
      setError("Describe the frequency, e.g. every Saturday.");
      return;
    }
    const parsedPeople = Number(form.peopleNeeded);
    if (!Number.isFinite(parsedPeople) || parsedPeople <= 0) {
      setError("Enter a valid number of people.");
      return;
    }

    const listing: JobListing = {
      id: newId("job"),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category as Category,
      modality,
      amount: parsedAmount,
      units: parsedUnits,
      frequency: modality === "recurrente" ? frequency.trim() : undefined,
      negotiable,
      includesTransport,
      includesMaterials,
      includesMeals,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      schedule: form.schedule.trim(),
      zone: form.zone.trim(),
      city: form.city.trim() || "Ciudad de Guatemala",
      peopleNeeded: parsedPeople,
      requirements: form.requirements.trim() || undefined,
      status: "publicado",
      publisher: {
        id: "local-user",
        name: session?.user?.name ?? "You",
        avatar: "🙂",
      },
      publisherVerified: Boolean(session?.user),
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (!form.title.trim() || !form.description.trim() || !form.startDate || !form.schedule.trim() || !form.zone.trim()) {
      setError("Fill in all required fields (title, description, dates, schedule and zone).");
      return;
    }

    publishListing(listing);
    setPublishedId(listing.id);
    setSubmitted(true);
  }

  if (submitted && publishedId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Job published!</h1>
        <p className="mt-2 text-muted">
          Your job is now visible for people looking for work in your area.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.push(`/jobs/${publishedId}`)}
            className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            View your job
          </button>
          <button
            onClick={() => router.push("/jobs")}
            className="rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground hover:bg-card-hover transition-colors"
          >
            Back to jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Post a job</h1>
      <p className="mt-1 text-muted">
        Describe the work, the payment and the conditions. Applicants will apply through
        the listing.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title <span className="text-danger">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="e.g. Gardening helper"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Category <span className="text-danger">*</span>
          </label>
          <select
            id="category"
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value as Category | "")}
            className={inputClass}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            required
            rows={5}
            placeholder="What needs to be done, where and when..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Modality */}
        <div>
          <p className="text-sm font-medium text-foreground">
            Modality <span className="text-danger">*</span>
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {jobModalities.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setModality(m.id);
                  if (m.id !== "recurrente") setFrequency("");
                  if (m.id !== "por_hora" && m.id !== "por_dia") setUnits("");
                }}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  modality === m.id
                    ? "border-primary/50 bg-primary-light"
                    : "border-border bg-card hover:bg-card-hover"
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    modality === m.id ? "text-primary" : "text-foreground"
                  }`}
                >
                  {m.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">{m.example}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Units or frequency */}
        {needUnits && (
          <div>
            <label htmlFor="units" className="block text-sm font-medium text-foreground">
              Number of {modality === "por_hora" ? "hours" : "days"} <span className="text-danger">*</span>
            </label>
            <input
              id="units"
              type="number"
              min={1}
              required={needUnits}
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder={modality === "por_hora" ? "e.g. 4" : "e.g. 3"}
              className={inputClass}
            />
          </div>
        )}
        {modality === "recurrente" && (
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-foreground">
              Frequency <span className="text-danger">*</span>
            </label>
            <input
              id="frequency"
              type="text"
              required
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. Every Saturday"
              className={inputClass}
            />
          </div>
        )}

        {/* Payment */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground">
            Payment <span className="text-danger">*</span>
          </label>
          <input
            id="amount"
            type="number"
            min={1}
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 40"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">
            {selectedModality
              ? `${money(Number(amount) || 0)} ${selectedModality.label.toLowerCase()} — ${selectedModality.example}`
              : ""}
          </p>
        </div>

        {/* Negotiable + includes */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-card-hover transition-colors">
            <input
              type="checkbox"
              checked={negotiable}
              onChange={(e) => setNegotiable(e.target.checked)}
              className="accent-primary"
            />
            Payment is negotiable
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-card-hover transition-colors">
            <input
              type="checkbox"
              checked={includesTransport}
              onChange={(e) => setIncludesTransport(e.target.checked)}
              className="accent-primary"
            />
            Includes transport
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-card-hover transition-colors">
            <input
              type="checkbox"
              checked={includesMaterials}
              onChange={(e) => setIncludesMaterials(e.target.checked)}
              className="accent-primary"
            />
            Includes materials
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-card-hover transition-colors">
            <input
              type="checkbox"
              checked={includesMeals}
              onChange={(e) => setIncludesMeals(e.target.checked)}
              className="accent-primary"
            />
            Includes meals
          </label>
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-foreground">
              Start date <span className="text-danger">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-foreground">
              End date (optional)
            </label>
            <input
              id="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-foreground">
            Schedule <span className="text-danger">*</span>
          </label>
          <input
            id="schedule"
            type="text"
            required
            placeholder="e.g. 8:00 AM – 12:00 PM"
            value={form.schedule}
            onChange={(e) => update("schedule", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Zone / city */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="zone" className="block text-sm font-medium text-foreground">
              Approximate zone <span className="text-danger">*</span>
            </label>
            <input
              id="zone"
              type="text"
              required
              placeholder="e.g. Zona 15"
              value={form.zone}
              onChange={(e) => update("zone", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted">
              Never share your exact address. It&apos;s revealed only after an agreement.
            </p>
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground">
              City
            </label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* People */}
        <div>
          <label htmlFor="peopleNeeded" className="block text-sm font-medium text-foreground">
            Number of people
          </label>
          <input
            id="peopleNeeded"
            type="number"
            min={1}
            value={form.peopleNeeded}
            onChange={(e) => update("peopleNeeded", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-foreground">
            Requirements (optional)
          </label>
          <textarea
            id="requirements"
            rows={3}
            placeholder="e.g. Basic gardening experience"
            value={form.requirements}
            onChange={(e) => update("requirements", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p>
        )}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Publish job
          </button>
          <button
            type="button"
            onClick={() => router.push("/jobs")}
            className="rounded-full border border-border bg-card px-8 py-3 text-base font-semibold text-foreground hover:bg-card-hover transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}