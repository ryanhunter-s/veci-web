"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/utils/data";

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/explorar"), 2000);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">¡Solicitud publicada!</h1>
        <p className="mt-2 text-muted">Tus vecinos podrán verte y responder pronto. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Pedir ayuda</h1>
      <p className="mt-1 text-muted">Describe lo que necesitas y tu comunidad te ayudará.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Título
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="¿Qué necesitas?"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Categoría
          </label>
          <select
            id="category"
            required
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Descripción
          </label>
          <textarea
            id="description"
            required
            rows={5}
            placeholder="Cuéntanos más detalles sobre lo que necesitas..."
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground">
            Ubicación
          </label>
          <input
            id="location"
            type="text"
            required
            placeholder="Ej: Col. Centro, calle 5 de Mayo"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-foreground">
            Tu nombre
          </label>
          <input
            id="author"
            type="text"
            required
            placeholder="¿Cómo te llamas?"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Publicar solicitud
        </button>
      </form>
    </div>
  );
}
