"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";
import { categories } from "@/utils/data";
import { registerWorker, newId } from "@/lib/workers-store";
import { jobModalities } from "@/utils/jobs";
import { modalityRateLabel } from "@/utils/workers";
import type { Category, JobModality, WorkerProfile } from "@/types";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

export default function NewWorkerPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<JobModality[]>([]);
  const [rate, setRate] = useState("");
  const [rateModality, setRateModality] = useState<JobModality>("por_hora");
  const [negotiable, setNegotiable] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    title: "",
    bio: "",
    zone: "",
    city: "Ciudad de Guatemala",
    availability: "",
    experience: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCategory(cat: Category) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleModality(m: JobModality) {
    setSelectedModalities((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Keep the photo under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const parsedRate = Number(rate);
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      setError("Enter a valid rate.");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Select at least one category.");
      return;
    }
    if (selectedModalities.length === 0) {
      setError("Select at least one payment modality.");
      return;
    }
    if (!selectedModalities.includes(rateModality) && selectedModalities.length > 0) {
      setRateModality(selectedModalities[0]);
    }

    const worker: WorkerProfile = {
      id: newId("worker"),
      name: form.name.trim() || "Worker",
      avatar: "🙂",
      photo: photo ?? undefined,
      title: form.title.trim(),
      bio: form.bio.trim(),
      categories: selectedCategories,
      modalities: selectedModalities,
      rate: parsedRate,
      rateModality: selectedModalities.includes(rateModality)
        ? rateModality
        : selectedModalities[0],
      negotiable,
      zone: form.zone.trim(),
      city: form.city.trim() || "Ciudad de Guatemala",
      availability: form.availability.trim(),
      experience: form.experience.trim(),
      verified: Boolean(session?.user),
      rating: 0,
      completedJobs: 0,
      status: "disponible",
      createdAt: new Date().toISOString(),
    };

    registerWorker(worker);
    setPublishedId(worker.id);
    setSubmitted(true);
  }

  if (submitted && publishedId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Profile published!</h1>
        <p className="mt-2 text-muted">
          Your profile is now visible to neighbors looking for help in your area.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.push(`/workers/${publishedId}`)}
            className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            View your profile
          </button>
          <button
            onClick={() => router.push("/workers")}
            className="rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground hover:bg-card-hover transition-colors"
          >
            Back to workers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Create your worker profile</h1>
      <p className="mt-1 text-muted">
        Show your skills, your rate and your availability so neighbors can contact you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">Profile photo</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Avatar name={form.name.trim() || "Worker"} photo={photo} size={72} />
            <div className="min-w-0">
              <label className="inline-block cursor-pointer rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="sr-only"
                />
              </label>
              {photo ? (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="ml-2 text-sm font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              ) : (
                <p className="mt-1.5 text-xs text-muted">
                  Optional. Without a photo we show your initials on a colored avatar.
                </p>
              )}
              {photoError && (
                <p className="mt-1.5 text-xs text-danger">{photoError}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title / specialty <span className="text-danger">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Gardener and lawn care"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-foreground">
            About you <span className="text-danger">*</span>
          </label>
          <textarea
            id="bio"
            required
            rows={4}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="What do you do, where do you work, what do you bring..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Categories */}
        <div>
          <p className="text-sm font-medium text-foreground">
            What services do you offer? <span className="text-danger">*</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary/50 bg-primary-light text-primary"
                      : "border-border bg-card text-muted hover:bg-card-hover"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modalities */}
        <div>
          <p className="text-sm font-medium text-foreground">
            How do you charge? <span className="text-danger">*</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {jobModalities.map((m) => {
              const active = selectedModalities.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleModality(m.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary/50 bg-primary-light text-primary"
                      : "border-border bg-card text-muted hover:bg-card-hover"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rate */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-foreground">
              Your rate <span className="text-danger">*</span>
            </label>
            <input
              id="rate"
              type="number"
              min={1}
              step="any"
              required
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 40"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="rateModality" className="block text-sm font-medium text-foreground">
              Billing unit
            </label>
            <select
              id="rateModality"
              value={rateModality}
              onChange={(e) => setRateModality(e.target.value as JobModality)}
              className={inputClass}
            >
              {jobModalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {modalityRateLabel(m.id)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-card-hover transition-colors">
          <input
            type="checkbox"
            checked={negotiable}
            onChange={(e) => setNegotiable(e.target.checked)}
            className="accent-primary"
          />
          My rate is negotiable
        </label>

        {/* Zone / city */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="zone" className="block text-sm font-medium text-foreground">
              Work zone <span className="text-danger">*</span>
            </label>
            <input
              id="zone"
              type="text"
              required
              value={form.zone}
              onChange={(e) => update("zone", e.target.value)}
              placeholder="e.g. Zona 10"
              className={inputClass}
            />
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

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-foreground">
            Availability <span className="text-danger">*</span>
          </label>
          <input
            id="availability"
            type="text"
            required
            value={form.availability}
            onChange={(e) => update("availability", e.target.value)}
            placeholder="e.g. Mon–Sat, 8 AM – 6 PM"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-foreground">
            Experience
          </label>
          <input
            id="experience"
            type="text"
            value={form.experience}
            onChange={(e) => update("experience", e.target.value)}
            placeholder="e.g. 4 years as a handyman"
            className={inputClass}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p>}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Publish profile
          </button>
          <button
            type="button"
            onClick={() => router.push("/workers")}
            className="rounded-full border border-border bg-card px-8 py-3 text-base font-semibold text-foreground hover:bg-card-hover transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}