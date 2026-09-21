import Link from "next/link";
import { mockJobs, mockComments, mockChats, mockRequests } from "@/utils/data";
import { formatRelativeTime } from "@/utils/format";
import { jobStatusStyles, commentStatusStyles } from "@/components/dashboard/status";

export default function DashboardOverview() {
  const activeJobs = mockJobs.filter((j) => j.status !== "completada" && j.status !== "cancelada");
  const completedJobs = mockJobs.filter((j) => j.status === "completada");
  const pendingComments = mockComments.filter((c) => c.status === "pendiente");
  const unreadMessages = mockChats.reduce(
    (acc, chat) =>
      acc + chat.messages.filter((m) => !m.read && m.senderId !== chat.participantId).length,
    0
  );

  const activity: {
    id: string;
    type: "trabajo" | "comentario" | "chat";
    text: string;
    date: string;
  }[] = [
    ...mockJobs.map((j) => ({
      id: `j-${j.id}`,
      type: "trabajo" as const,
      text: `Job with ${j.helperName} moved to "${jobStatusStyles[j.status].label}"`,
      date: j.acceptedAt,
    })),
    ...mockComments.map((c) => ({
      id: `c-${c.id}`,
      type: "comentario" as const,
      text: `Comment from ${c.author}: "${c.content.slice(0, 60)}..."`,
      date: c.createdAt,
    })),
    ...mockChats.flatMap((chat) =>
      chat.messages
        .filter((m) => !m.read)
        .map((m) => ({
          id: `m-${m.id}`,
          type: "chat" as const,
          text: `Message from ${chat.participantName}: "${m.content.slice(0, 60)}..."`,
          date: m.sentAt,
        }))
    ),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const activityIcons = {
    trabajo: "🔧",
    comentario: "💬",
    chat: "💭",
  };

  const stats = [
    { label: "Active jobs", value: activeJobs.length, icon: "🔧", href: "/dashboard/jobs", color: "text-sky-600 bg-sky-100" },
    { label: "Completed jobs", value: completedJobs.length, icon: "✅", href: "/dashboard/jobs", color: "text-green-600 bg-green-100" },
    { label: "Comments to moderate", value: pendingComments.length, icon: "💬", href: "/dashboard/comments", color: "text-amber-600 bg-amber-100" },
    { label: "Unread messages", value: unreadMessages, icon: "💭", href: "/dashboard/chats", color: "text-primary bg-primary-light" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Overview</h1>
        <p className="mt-1 text-muted">This is what&apos;s happening in your community today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl ${s.color}`}>
              {s.icon}
            </span>
            <p className="mt-3 text-3xl font-bold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
            <Link href="/dashboard/jobs" className="text-sm text-primary hover:text-primary-hover transition-colors">
              See all
            </Link>
          </div>
          <div className="mt-4 space-y-1">
            {activity.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-muted-light transition-colors"
              >
                <span className="mt-0.5 text-lg">{activityIcons[a.type]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatRelativeTime(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Open requests</h2>
          <div className="mt-4 space-y-2">
            {mockRequests
              .filter((r) => r.status === "abierta")
              .slice(0, 5)
              .map((r) => (
                <Link
                  key={r.id}
                  href={`/request/${r.id}`}
                  className="block rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/30 hover:bg-card-hover"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-1">{r.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {r.location} &middot; {r.responses} responses
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {pendingComments.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-semibold text-foreground">
                  You have {pendingComments.length} comment{pendingComments.length > 1 ? "s" : ""} to moderate
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Review the pending comments to keep the community healthy.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/comments"
              className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 transition-opacity"
            >
              Review
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}