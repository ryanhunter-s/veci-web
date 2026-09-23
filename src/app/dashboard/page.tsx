import Link from "next/link";
import { auth } from "@/lib/auth";
import { mockJobs, mockComments, mockChats, mockRequests } from "@/utils/data";
import { formatRelativeTime } from "@/utils/format";
import { jobStatusStyles } from "@/components/dashboard/status";
import {
  Wrench,
  CheckCircle2,
  MessageSquare,
  MessagesSquare,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Phone,
  BadgeCheck,
  ArrowRight,
  Plus,
} from "lucide-react";

export default async function DashboardOverview() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Neighbor";

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
    trabajo: <Wrench className="h-[18px] w-[18px] text-sky-600" />,
    comentario: <MessageSquare className="h-[18px] w-[18px] text-amber-600" />,
    chat: <MessagesSquare className="h-[18px] w-[18px] text-primary" />,
  };

  const activityColors = {
    trabajo: "bg-sky-100",
    comentario: "bg-amber-100",
    chat: "bg-primary-light",
  };

  const stats = [
    { label: "Active jobs", value: activeJobs.length, icon: <Wrench className="h-5 w-5 text-sky-600" />, iconBg: "bg-sky-100", href: "/dashboard/jobs", accent: "text-sky-600" },
    { label: "Completed jobs", value: completedJobs.length, icon: <CheckCircle2 className="h-5 w-5 text-success" />, iconBg: "bg-mint", href: "/dashboard/jobs", accent: "text-success" },
    { label: "Comments to moderate", value: pendingComments.length, icon: <MessageSquare className="h-5 w-5 text-amber-600" />, iconBg: "bg-amber-100", href: "/dashboard/comments", accent: "text-amber-600" },
    { label: "Unread messages", value: unreadMessages, icon: <MessagesSquare className="h-5 w-5 text-primary" />, iconBg: "bg-primary-light", href: "/dashboard/chats", accent: "text-primary" },
  ];

  const verificationSteps = [
    { label: "Email address", done: !!session?.user?.isEmailVerified, icon: Mail },
    { label: "Phone number", done: !!session?.user?.phoneVerified, icon: Phone },
    { label: "Identity (DPI / Passport)", done: !!session?.user?.identityVerified, icon: ShieldCheck },
  ];
  const verifiedCount = verificationSteps.filter((s) => s.done).length;
  const fullyVerified = verifiedCount === verificationSteps.length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back, {firstName}{" "}
          {fullyVerified && <BadgeCheck className="mb-1 inline h-6 w-6 text-primary" />}
        </h1>
        <p className="mt-1 text-muted">{today} &middot; Here&apos;s what&apos;s happening in your community.</p>
      </div>

      {fullyVerified ? (
        <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-mint px-5 py-4 animate-fade-in-up">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/10">
            <ShieldCheck className="h-5 w-5 text-success" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">You&apos;re fully verified</p>
            <p className="text-sm text-muted">
              Your neighbors know they can trust you. Keep it up!
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-primary/25 bg-primary-light/40 p-5 animate-fade-in-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Complete your verification — {verifiedCount} of {verificationSteps.length} done
                </p>
                <p className="text-sm text-muted">
                  Verified members get more responses and are preferred by neighbors.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Complete now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {verificationSteps.map((step) => {
              const Icon = step.icon;
              return (
                <span
                  key={step.label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    step.done
                      ? "border-success/30 bg-mint text-success"
                      : "border-border bg-card text-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : "Pending"} {step.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            style={{ animationDelay: `${i * 70}ms` }}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up"
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                {s.icon}
              </span>
              <ArrowRight className="h-4 w-4 text-border transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
            <Link href="/dashboard/jobs" className="text-sm font-medium text-primary transition-colors hover:text-primary-hover">
              See all
            </Link>
          </div>
          <div className="mt-4 space-y-1">
            {activity.map((a, i) => (
              <div
                key={a.id}
                style={{ animationDelay: `${150 + i * 60}ms` }}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted-light animate-fade-in-up"
              >
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activityColors[a.type]}`}>
                  {activityIcons[a.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatRelativeTime(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Open requests</h2>
            <Link href="#" className="flex items-center gap-1 rounded-full bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-blue-200">
              <Plus className="h-4 w-4" /> New
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {mockRequests
              .filter((r) => r.status === "abierta")
              .slice(0, 5)
              .map((r, i) => (
                <Link
                  key={r.id}
                  href={`/request/${r.id}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="group block rounded-xl border border-border px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card-hover hover:shadow-md hover:shadow-primary/5 animate-fade-in-up"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{r.title}</p>
                    <ArrowRight className="h-4 w-4 shrink-0 text-border transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {r.location} &middot; {r.responses} responses
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {pendingComments.length > 0 && (
        <section className="flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </span>
            <div>
              <h2 className="font-semibold text-foreground">
                You have {pendingComments.length} comment{pendingComments.length > 1 ? "s" : ""} to moderate
              </h2>
              <p className="mt-1 text-sm text-muted">
                Review the pending comments to keep the community healthy and friendly.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/comments"
            className="hidden shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-80 sm:flex"
          >
            Review <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
}