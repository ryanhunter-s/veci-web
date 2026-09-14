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
      text: `Trabajo con ${j.helperName} pasó a "${jobStatusStyles[j.status].label}"`,
      date: j.acceptedAt,
    })),
    ...mockComments.map((c) => ({
      id: `c-${c.id}`,
      type: "comentario" as const,
      text: `Comentario de ${c.author}: "${c.content.slice(0, 60)}..."`,
      date: c.createdAt,
    })),
    ...mockChats.flatMap((chat) =>
      chat.messages
        .filter((m) => !m.read)
        .map((m) => ({
          id: `m-${m.id}`,
          type: "chat" as const,
          text: `Mensaje de ${chat.participantName}: "${m.content.slice(0, 60)}..."`,
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
    { label: "Trabajos activos", value: activeJobs.length, icon: "🔧", href: "/dashboard/trabajos", color: "text-sky-600 bg-sky-100" },
    { label: "Trabajos completados", value: completedJobs.length, icon: "✅", href: "/dashboard/trabajos", color: "text-green-600 bg-green-100" },
    { label: "Comentarios por moderar", value: pendingComments.length, icon: "💬", href: "/dashboard/comentarios", color: "text-amber-600 bg-amber-100" },
    { label: "Mensajes sin leer", value: unreadMessages, icon: "💭", href: "/dashboard/chats", color: "text-primary bg-primary-light" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Resumen</h1>
        <p className="mt-1 text-muted">Esto es lo que ocurre en tu comunidad hoy.</p>
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
            <h2 className="text-lg font-semibold text-foreground">Actividad reciente</h2>
            <Link href="/dashboard/trabajos" className="text-sm text-primary hover:text-primary-hover transition-colors">
              Ver todo
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
          <h2 className="text-lg font-semibold text-foreground">Solicitudes abiertas</h2>
          <div className="mt-4 space-y-2">
            {mockRequests
              .filter((r) => r.status === "abierta")
              .slice(0, 5)
              .map((r) => (
                <Link
                  key={r.id}
                  href={`/solicitud/${r.id}`}
                  className="block rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/30 hover:bg-card-hover"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-1">{r.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {r.location} &middot; {r.responses} respuestas
                  </p>
                </Link>
              ))}
          </div>
          <Link
            href="/explorar"
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Ir a explorar &rarr;
          </Link>
        </section>
      </div>

      {pendingComments.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-semibold text-foreground">
                  Tienes {pendingComments.length} comentario{pendingComments.length > 1 ? "s" : ""} por moderar
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Revisiona los comentarios pendientes para mantener la comunidad sana.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/comentarios"
              className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 transition-opacity"
            >
              Revisar
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}