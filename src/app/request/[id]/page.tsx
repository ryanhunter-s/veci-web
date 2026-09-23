import Link from "next/link";
import { mockRequests, categories } from "@/utils/data";

const statusLabels: Record<string, { text: string; color: string }> = {
  abierta: { text: "Open", color: "bg-green-100 text-green-700" },
  en_progreso: { text: "In progress", color: "bg-yellow-100 text-yellow-700" },
  completada: { text: "Completed", color: "bg-gray-100 text-gray-500" },
};

export default async function RequestPage({ params }: PageProps<"/request/[id]">) {
  const { id } = await params;
  const request = mockRequests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-5xl">😕</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Request not found</h1>
        <Link href="/" className="mt-4 inline-block text-primary hover:text-primary-hover font-medium">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  const cat = categories.find((c) => c.id === request.category);
  const status = statusLabels[request.status];

  const date = new Date(request.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
        &larr; Back
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cat?.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{request.title}</h1>
              <p className="text-sm text-muted">{request.location}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <span className="rounded-full px-2.5 py-0.5 bg-muted-light text-xs font-medium">
            {cat?.label}
          </span>
          <span>&middot;</span>
          <span>{formattedDate}</span>
        </div>

        <p className="mt-6 text-foreground leading-relaxed whitespace-pre-line">{request.description}</p>

        <div className="mt-6 rounded-xl bg-muted-light p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{request.author.avatar}</span>
            <div>
              <p className="font-medium text-foreground">{request.author.name}</p>
              <p className="text-sm text-muted">Posted by this neighbor</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            I want to help
          </button>
          <button className="flex-1 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors">
            Private message
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">
            {request.responses} {request.responses === 1 ? "response" : "responses"}
          </h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-muted-light p-4">
              <div className="flex items-center gap-2">
                <span>🧑</span>
                <span className="font-medium text-sm text-foreground">Anonymous neighbor</span>
                <span className="text-xs text-muted">&middot; 2h ago</span>
              </div>
              <p className="mt-2 text-sm text-muted">I can help you with that, send me a private message.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
