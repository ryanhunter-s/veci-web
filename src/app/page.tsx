import Link from "next/link";
import RequestCard from "@/components/RequestCard";
import { categories, mockRequests } from "@/utils/data";

const steps = [
  {
    icon: "📝",
    title: "Publica lo que necesitas",
    description:
      "Cuéntale a tu vecindario qué necesitas: una reparación, un favor, un aviso. En menos de un minuto tu solicitud está en línea.",
  },
  {
    icon: "🤝",
    title: "Tu comunidad responde",
    description:
      "Los vecinos cercanos ven tu solicitud y pueden ofrecer ayuda, recomendarte a alguien de confianza o colaborar contigo.",
  },
  {
    icon: "✅",
    title: "Resuelvan juntos",
    description:
      "Coordinen por mensaje, resuelvan lo que necesites y marca la solicitud como completada cuando el problema esté solucionado.",
  },
];

const stats = [
  { value: "350+", label: "Vecinos registrados" },
  { value: "120+", label: "Ayudas completadas" },
  { value: "6", label: "Colonias activas" },
  { value: "97%", label: "Solicitudes atendidas" },
];

const testimonials = [
  {
    quote:
      "Se me descompuso la lavadora y en menos de una hora un vecino me recomendó a un técnico de confianza. ¡Increíble lo que se logra en comunidad!",
    name: "María G.",
    neighborhood: "Centro",
    avatar: "👩",
  },
  {
    quote:
      "Ayudé a pasar corriente a un vecino que no conocía. Desde entonces somos amigos y nos ayudamos seguido. Veci cambió la dinámica de mi cuadra.",
    name: "Carlos L.",
    neighborhood: "Las Parcelas",
    avatar: "👨",
  },
  {
    quote:
      "Encontré un perrito perdido y en unas horas ya estaba de vuelta con su familia. ¡Gracias a todos los que compartieron el aviso!",
    name: "Pedro S.",
    neighborhood: "Parque Principal",
    avatar: "👴",
  },
];

export default function Home() {
  const recentRequests = mockRequests.filter((r) => r.status !== "completada").slice(0, 4);

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
              🏘️ Tu red de ayuda vecinal
            </span>

            <h1
              className="animate-fade-in-up mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
              style={{ animationDelay: "0.15s" }}
            >
              Tu barrio, tu gente.
              <br />
              <span className="animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Ayúdate entre todos.
              </span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl"
              style={{ animationDelay: "0.3s" }}
            >
              Veci conecta a las personas que viven cerca. Pide ayuda para reparaciones,
              compras, transportes y avisos del barrio, o ofrece tu tiempo para construir una
              comunidad más fuerte.
            </p>

            <div
              className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "0.45s" }}
            >
              <Link
                href="/nueva"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/35 hover:-translate-y-0.5 transition-all"
              >
                Pedir ayuda gratis
              </Link>
              <Link
                href="/explorar"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur hover:bg-card-hover hover:-translate-y-0.5 transition-all"
              >
                Ver solicitudes
              </Link>
            </div>

            <p
              className="animate-fade-in mt-6 text-sm text-muted"
              style={{ animationDelay: "0.6s" }}
            >
              Sin costo &middot; Sin spam &middot; Solo vecinos
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
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

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            ¿Cómo funciona Veci?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Tres pasos simples para pedir ayuda o ayudar a alguien de tu comunidad.
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
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-background to-primary/5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              ¿En qué podemos apoyarte?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Estas son las categorías más usadas por tu comunidad. Toca una para ver las
              solicitudes activas.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/explorar?categoria=${cat.id}`}
                className="animate-pop-in group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-foreground">{cat.label}</span>
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

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Solicitudes recientes</h2>
            <p className="mt-2 text-muted">
              Esto es lo que tu comunidad está pidiendo hoy.
            </p>
          </div>
          <Link
            href="/explorar"
            className="hidden text-sm font-medium text-primary hover:text-primary-hover transition-colors sm:block"
          >
            Ver todas &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {recentRequests.map((req, i) => (
            <div
              key={req.id}
              className="animate-fade-in-up animate-pop-in"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <RequestCard request={req} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/explorar"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Ver todas &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Historias de tu comunidad
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Vecinos reales resolviendo problemas reales, juntos.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                className="animate-fade-in-up flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <span className="text-2xl text-accent">"</span>
                <blockquote className="flex-1 text-sm leading-6 text-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
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
          <span className="animate-bounce-soft inline-block text-5xl">🏘️</span>
          <h2 className="animate-fade-in-up mt-6 text-3xl font-bold text-foreground sm:text-4xl">
            Tu comunidad te necesita hoy
          </h2>
          <p className="animate-fade-in-up mx-auto mt-4 max-w-xl text-lg text-muted" style={{ animationDelay: "0.1s" }}>
            Únete gratis, publica tu primera solicitud y descubre lo que se siente que
            tu barrio te apoye.
          </p>
          <div
            className="animate-fade-in-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
            >
              Crear mi cuenta gratis
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur hover:bg-card-hover hover:-translate-y-0.5 transition-all"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}