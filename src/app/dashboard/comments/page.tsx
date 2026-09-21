"use client";

import { useState } from "react";
import { mockComments, mockRequests } from "@/utils/data";
import { formatRelativeTime } from "@/utils/format";
import { commentStatusStyles } from "@/components/dashboard/status";
import type { RequestComment, CommentStatus } from "@/types";

export default function CommentsPage() {
  const [comments, setComments] = useState<RequestComment[]>(mockComments);
  const [filter, setFilter] = useState<CommentStatus | "all">("all");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered =
    filter === "all" ? comments : comments.filter((c) => c.status === filter);

  function updateStatus(id: string, status: CommentStatus) {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function sendReply(id: string) {
    const text = replyText.trim();
    if (!text) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "aprobado" as const, content: `${c.content}\n\n[Veci] ${text}` }
          : c
      )
    );
    setReplyId(null);
    setReplyText("");
  }

  const counts = {
    all: comments.length,
    pendiente: comments.filter((c) => c.status === "pendiente").length,
    aprobado: comments.filter((c) => c.status === "aprobado").length,
    oculto: comments.filter((c) => c.status === "oculto").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Comments</h1>
        <p className="mt-1 text-muted">
          Review, approve, and respond to request comments.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(counts) as (CommentStatus | "all")[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-muted-light text-muted hover:bg-border"
            }`}
          >
            {s === "all" ? "All" : commentStatusStyles[s as CommentStatus].label} ({counts[s as CommentStatus | "all"]})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((comment) => {
          const request = mockRequests.find((r) => r.id === comment.requestId);
          const style = commentStatusStyles[comment.status];

          return (
            <div key={comment.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comment.authorAvatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{comment.author}</p>
                    <p className="text-xs text-muted">
                      On: {request?.title ?? "Deleted request"}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.color}`}>
                  {style.label}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-foreground whitespace-pre-line">
                {comment.content}
              </p>

              <p className="mt-2 text-xs text-muted">{formatRelativeTime(comment.createdAt)}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {comment.status !== "aprobado" && (
                  <button
                    onClick={() => updateStatus(comment.id, "aprobado")}
                    className="rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-200 transition-colors"
                  >
                    ✓ Approve
                  </button>
                )}
                {comment.status !== "oculto" && (
                  <button
                    onClick={() => updateStatus(comment.id, "oculto")}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted hover:bg-card-hover transition-colors"
                  >
                    🙈 Hide
                  </button>
                )}
                <button
                  onClick={() => {
                    setReplyId(replyId === comment.id ? null : comment.id);
                    setReplyText("");
                  }}
                  className="rounded-full bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary hover:bg-blue-200 transition-colors"
                >
                  💬 Reply
                </button>
                {comment.status === "pendiente" && (
                  <span className="ml-auto text-xs text-amber-600">
                    Awaiting moderation
                  </span>
                )}
              </div>

              {replyId === comment.id && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendReply(comment.id)}
                    placeholder="Write your reply as Veci..."
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={() => sendReply(comment.id)}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-3xl">💬</p>
            <p className="mt-2 text-lg font-medium text-foreground">No comments</p>
            <p className="mt-1 text-sm text-muted">Nothing to moderate in this view for now.</p>
          </div>
        )}
      </div>
    </div>
  );
}