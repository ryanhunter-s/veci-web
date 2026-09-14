"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/schemas";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function ConfiguracionPage() {
  const { data: session } = useSession();

  const [profile, setProfile] = useState({
    name: session?.user?.name ?? "María García",
    email: session?.user?.email ?? "maria@email.com",
    neighborhood: "Centro",
  });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    responses: true,
    community: false,
  });

  const [preferences, setPreferences] = useState({
    showOnline: true,
    showNeighborhood: true,
    anonymousSearch: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  function saveProfile() {
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  function onChangePassword(_values: ChangePasswordValues) {
    reset();
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Configuración</h1>
        <p className="mt-1 text-muted">Administra tu perfil, notificaciones y seguridad.</p>
      </div>

      {status === "saved" && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-pop-in">
          ✓ Cambios guardados correctamente.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Nombre</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Colonia o barrio</label>
              <input
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <button
              onClick={saveProfile}
              className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Guardar perfil
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
          <div className="mt-3 divide-y divide-border">
            <Toggle
              checked={notifications.email}
              onChange={(v) => setNotifications({ ...notifications, email: v })}
              label="Notificaciones por email"
              description="Recibe un correo cuando haya novedades en tus solicitudes."
            />
            <Toggle
              checked={notifications.push}
              onChange={(v) => setNotifications({ ...notifications, push: v })}
              label="Notificaciones push"
              description="Avisos al instante desde el navegador."
            />
            <Toggle
              checked={notifications.responses}
              onChange={(v) => setNotifications({ ...notifications, responses: v })}
              label="Respuestas a mis solicitudes"
              description="Avisar cuando alguien responda o acepte un trabajo."
            />
            <Toggle
              checked={notifications.community}
              onChange={(v) => setNotifications({ ...notifications, community: v })}
              label="Avisos de la comunidad"
              description="Alertas del barrio: cortes de agua, luz, reuniones."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Seguridad</h2>
          <form onSubmit={handleSubmit(onChangePassword)} className="mt-4 space-y-4 noValidate">
            <div>
              <label className="block text-sm font-medium text-foreground">Contraseña actual</label>
              <input
                type="password"
                autoComplete="current-password"
                {...register("currentPassword")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.currentPassword && (
                <p className="mt-1.5 text-sm text-danger">{errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Nueva contraseña</label>
              <input
                type="password"
                autoComplete="new-password"
                {...register("newPassword")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.newPassword && (
                <p className="mt-1.5 text-sm text-danger">{errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Confirmar nueva contraseña</label>
              <input
                type="password"
                autoComplete="new-password"
                {...register("confirmNewPassword")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.confirmNewPassword && (
                <p className="mt-1.5 text-sm text-danger">{errors.confirmNewPassword.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted-light transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Privacidad</h2>
          <div className="mt-3 divide-y divide-border">
            <Toggle
              checked={preferences.showOnline}
              onChange={(v) => setPreferences({ ...preferences, showOnline: v })}
              label="Mostrar estado conectado"
              description="Deja que otros vecinos vean si estás disponible."
            />
            <Toggle
              checked={preferences.showNeighborhood}
              onChange={(v) => setPreferences({ ...preferences, showNeighborhood: v })}
              label="Mostrar mi colonia"
              description="Tu barrio es visible en tus solicitudes y respuestas."
            />
            <Toggle
              checked={preferences.anonymousSearch}
              onChange={(v) => setPreferences({ ...preferences, anonymousSearch: v })}
              label="Modo incógnito"
              description="Navega la comunidad sin aparecer en el directorio de vecinos."
            />
          </div>
          <div className="mt-4 rounded-xl bg-muted-light px-4 py-3 text-xs text-muted">
            Tu información solo es visible para personas de tu zona. Nunca compartimos tus datos
            con terceros.
          </div>
        </section>
      </div>
    </div>
  );
}