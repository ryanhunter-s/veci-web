"use client";

import { useState } from "react";
import { mockJobs, mockRequests, categories } from "@/utils/data";
import { formatDateTime, formatSchedule, formatRelativeTime } from "@/utils/format";
import { jobStatusStyles } from "@/components/dashboard/status";
import type { Job, JobStatus } from "@/types";

const statusOrder: JobStatus[] = ["aceptada", "en_progreso", "completada", "cancelada"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filter, setFilter] = useState<JobStatus | "all">("all");

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  function advanceStatus(id: string) {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const idx = statusOrder.indexOf(j.status);
        const next = statusOrder[idx] ?? j.status;
        if (next === "cancelada" || next === j.status) return j;
        return { ...j, status: next };
      })
    );
  }

  function cancelJob(id: string) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "cancelada" } : j)));
  }

  const counts = {
    all: jobs.length,
    aceptada: jobs.filter((j) => j.status === "aceptada").length,
    en_progreso: jobs.filter((j) => j.status === "en_progreso").length,
    completada: jobs.filter((j) => j.status === "completada").length,
    cancelada: jobs.filter((j) => j.status === "cancelada").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Jobs</h1>
        <p className="mt-1 text-muted">
          Record of the accepted requests and their follow-up.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", ...statusOrder] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-muted-light text-muted hover:bg-border"
            }`}
          >
            {s === "all"
              ? `All (${counts.all})`
              : `${jobStatusStyles[s].label} (${counts[s]})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((job) => {
          const request = mockRequests.find((r) => r.id === job.requestId);
          const category = request
            ? categories.find((c) => c.id === request.category)
            : undefined;
          const style = jobStatusStyles[job.status];

          return (
            <div
              key={job.id}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {style.label}
                    </span>
                    <span className="rounded-full bg-muted-light px-2.5 py-0.5 text-xs text-muted">
                      {category?.icon} {category?.label}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-foreground line-clamp-1">
                    {request?.title ?? "Deleted request"}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{job.helperAvatar}</span>
                      {job.helperName}
                    </span>
                    {job.price != null && (
                      <span className="font-medium text-foreground">
                        ${job.price.toLocaleString("en-US")}
                      </span>
                    )}
                    {job.scheduledFor && <span>🗓️ {formatSchedule(job.scheduledFor)}</span>}
                    <span>Accepted {formatRelativeTime(job.acceptedAt)}</span>
                  </div>
                  {job.notes && (
                    <p className="mt-2 rounded-xl bg-muted-light px-3 py-2 text-sm text-muted">
                      {job.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  {job.status !== "completada" && job.status !== "cancelada" && (
                    <button
                      onClick={() => advanceStatus(job.id)}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
                    >
                      {job.status === "aceptada" ? "Start job" : "Mark as completed"}
                    </button>
                  )}
                  {job.status !== "cancelada" && job.status !== "completada" && (
                    <button
                      onClick={() => cancelJob(job.id)}
                      className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:bg-card-hover hover:text-danger transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted">
                Accepted on {formatDateTime(job.acceptedAt)}
                {job.scheduledFor &&
                  ` · Scheduled for ${formatDateTime(job.scheduledFor)}`}
              </p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-3xl">🗂️</p>
            <p className="mt-2 text-lg font-medium text-foreground">No jobs here</p>
            <p className="mt-1 text-sm text-muted">
              {filter === "all"
                ? "When you accept a request it will appear in this record."
                : `No jobs with status "${jobStatusStyles[filter].label}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}