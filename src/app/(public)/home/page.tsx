import Link from "next/link";
import JobListingCard from "@/components/JobListingCard";
import WorkerCard from "@/components/WorkerCard";
import { IconLogo } from "@/components/Logo";
import { categories, mockJobListings, mockWorkers } from "@/utils/data";

const steps = [
  {
    icon: "📝",
    title: "Post what you need",
    description:
      "Tell your neighborhood what you need: a repair, a favor, an announcement. Your request is online in under a minute.",
  },
  {
    icon: "🤝",
    title: "Your community responds",
    description:
      "Nearby neighbors see your request and can offer help, recommend someone trustworthy, or get involved.",
  },
  {
    icon: "✅",
    title: "Resolve it together",
    description:
      "Coordinate through messages, get what you need done, and mark the request as completed once the problem is solved.",
  },
];

const stats = [
  { value: "350+", label: "Registered neighbors" },
  { value: "120+", label: "Completed favors" },
  { value: "6", label: "Active neighborhoods" },
  { value: "97%", label: "Requests answered" },
];

const testimonials = [
  {
    quote: "My washing machine broke down and within an hour a neighbor recommended a trustworthy technician. It's amazing what a community can achieve!",
    name: "María G.",
    neighborhood: "Centro",
    avatar: "👩",
  },
  {
    quote: "I jump-started a neighbor I didn't know. Since then we've become friends and help each other often. Veci changed the dynamic of my block.",
    name: "Carlos L.",
    neighborhood: "Las Parcelas",
    avatar: "👨",
  },
  {
    quote: "I found a lost puppy and within a few hours it was back with its family. Thanks to everyone who shared the post!",
    name: "Pedro S.",
    neighborhood: "Parque Principal",
    avatar: "👴",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

        <span
          className="animate-float absolute left-[8%] top-24 hidden rounded-2xl border border-border bg-card p-4 text-4xl shadow-lg sm:block"
          style={{ animationDelay: "0.2s" }}
        >
          🔧
        </span>
        <span
          className="animate-float absolute right-[10%] top-32 hidden rounded-2xl border border-border bg-card p-4 text-4xl shadow-lg sm:block"
          style={{ animationDelay: "1.2s" }}
        >
          🚗
        </span>
        <span
          className="animate-float-alt absolute bottom-24 left-[15%] hidden rounded-2xl border border-border bg-card p-4 text-4xl shadow-lg lg:block"
          style={{ animationDelay: "0.6s" }}
        >
          🐕
        </span>
        <span
          className="animate-float-alt absolute bottom-28 right-[16%] hidden rounded-2xl border border-border bg-card p-4 text-4xl shadow-lg lg:block"
          style={{ animationDelay: "1.6s" }}
        >
          🛒
        </span>

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <span
              className="animate-fade-in-up inline-block rounded-full border border-primary/20 bg-primary-light/60 px-4 py-1.5 text-sm font-medium text-primary"
              style={{ animationDelay: "0.05s" }}
            >
              🏘️ Your neighborhood help network
            </span>

            <h1
              className="animate-fade-in-up mt-6 text-4xl font-bold tracking-tight sm:text-6xl text-(--color-abyss)"
              style={{ animationDelay: "0.15s" }}
            >
              Your neighborhood, your people.
              <br />
              <span className="animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Help each other.
              </span>
            </h1>

            <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl" style={{ animationDelay: "0.3s" }}>
              Veci connects the people who live nearby. Ask for help with repairs, groceries, rides, and neighborhood notices, or offer your time to build a stronger community.
            </p>

            <div
              className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "0.45s" }}
            >
              <Link
                href="/new"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/35 hover:-translate-y-0.5 transition-all"
              >
                Get help free
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-8 py-3.5 text-base font-semibold text-(--color-abyss) backdrop-blur hover:bg-card-hover hover:-translate-y-0.5 transition-all"
              >
                Browse jobs
              </Link>
            </div>

            <p className="animate-fade-in mt-6 text-sm text-muted" style={{ animationDelay: "0.6s" }}>
              No cost &middot; No spam &middot; Neighbors only
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="animate-fade-in-up">
                <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-(--color-abyss) sm:text-4xl">
            How does Veci work?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Three simple steps to ask for help or help someone in your community.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="animate-fade-in-up relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <span className="absolute right-5 top-5 text-5xl font-bold text-muted-light/70">
                {i + 1}
              </span>
              <span className="inline-flex rounded-2xl bg-primary-light p-3 text-3xl">
                {step.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-(--color-abyss)">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-background to-primary/5 py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-(--color-abyss) sm:text-4xl">
              How can we help you?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              These are the categories your community uses most. Tap one to see the
              active requests.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/jobs?category=${cat.id}`}
                className="animate-pop-in group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-(--color-abyss)">{cat.label}</span>
                <span className="text-xs leading-5 text-muted">{cat.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-card py-3">
        <div className="animate-marquee flex w-max items-center">
          {[...categories, ...categories].map((cat, i) => (
            <span key={`${cat.id}-${i}`} className="mx-6 whitespace-nowrap text-sm text-muted">
              {cat.icon} {cat.label}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-(--color-abyss)">Jobs near you</h2>
            <p className="mt-2 text-muted">
              Paid work close to home — per hour, per day, per week or per project.
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden text-sm font-medium text-primary hover:text-primary-hover transition-colors sm:block"
          >
            See all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {mockJobListings.filter((l) => l.status === "publicado").slice(0, 6).map((listing) => ( <JobListingCard key={listing.id} listing={listing} /> ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/jobs"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            See all &rarr;
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-(--color-abyss)">Workers seeking work</h2>
            <p className="mt-2 text-muted">
              Skilled neighbors ready to help — with rates up front.
            </p>
          </div>
          <Link
            href="/workers"
            className="hidden text-sm font-medium text-primary hover:text-primary-hover transition-colors sm:block"
          >
            See all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {mockWorkers.filter((w) => w.status === "disponible").slice(0, 6).map((worker) => (<WorkerCard key={worker.id} worker={worker} />))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/workers"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            See all &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-(--color-abyss) sm:text-4xl">
              Community stories
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Real neighbors solving real problems together.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                className="animate-fade-in-up flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <span className="text-2xl text-accent">&quot;</span>
                <blockquote className="flex-1 text-sm leading-6 text-(--color-abyss)">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-(--color-abyss)">{t.name}</p>
                    <p className="text-xs text-muted">{t.neighborhood}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="animate-bounce-soft inline-block w-25">
            <IconLogo />
          </span>
          <h2 className="animate-fade-in-up mt-6 text-3xl font-bold text-(--color-abyss) sm:text-4xl">
            Your community needs you today
          </h2>
          <p className="animate-fade-in-up mx-auto mt-4 max-w-xl text-lg text-muted" style={{ animationDelay: "0.1s" }}>
            Join free, post your first request, and discover what it feels like when
            your neighborhood supports you.
          </p>
          <div
            className="animate-fade-in-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
            >
              Create my free account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-8 py-3.5 text-base font-semibold text-(--color-abyss) backdrop-blur hover:bg-card-hover hover:-translate-y-0.5 transition-all"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}