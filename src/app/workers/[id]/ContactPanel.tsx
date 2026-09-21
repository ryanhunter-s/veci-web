"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { WorkerProfile } from "@/types";
import { sendContact, newId } from "@/lib/workers-store";

export default function ContactPanel({ worker }: { worker: WorkerProfile }) {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (message.trim().length < 10) {
      setError("Write a message of at least 10 characters.");
      return;
    }
    sendContact({
      id: newId("msg"),
      workerId: worker.id,
      name: name.trim() || "Neighbor",
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-2xl">📨</p>
        <p className="mt-1 font-medium text-foreground">Message sent!</p>
        <p className="mt-1 text-sm text-muted">
          {worker.name.split(" ")[0]} will see your message and can reply through Veci chat.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-foreground">Contact {worker.name.split(" ")[0]}</h3>
      <p className="mt-1 text-sm text-muted">
        Tell them what you need, the dates and the zone. Exact address is shared after you
        both agree.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Your name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Hi, I need help with a move this Saturday in Zona 10..."
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Send message
        </button>
      </form>
    </div>
  );
}