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

export default function SettingsPage() {
  const { data: session } = useSession();

  const [profile, setProfile] = useState({
    name: session?.user?.name ?? "María García",
    email: session?.user?.email ?? "maria@email.com",
    neighborhood: session?.user?.neighborhood ?? "Centro",
    address: session?.user?.address ?? "",
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
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted">Manage your profile, notifications, and security.</p>
      </div>

      {status === "saved" && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-pop-in">
          ✓ Changes saved successfully.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Name</label>
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
              <label className="block text-sm font-medium text-foreground">Neighborhood</label>
              <input
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Address / zone</label>
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="e.g. Av. Reforma, Zona 10"
                className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <p className="mt-1 text-xs text-muted">
                Used to highlight the closest jobs to you. Never shown publicly.
              </p>
            </div>
            <button
              onClick={saveProfile}
              className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Save profile
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <div className="mt-3 divide-y divide-border">
            <Toggle
              checked={notifications.email}
              onChange={(v) => setNotifications({ ...notifications, email: v })}
              label="Email notifications"
              description="Receive an email when there's news about your requests."
            />
            <Toggle
              checked={notifications.push}
              onChange={(v) => setNotifications({ ...notifications, push: v })}
              label="Push notifications"
              description="Instant alerts straight from your browser."
            />
            <Toggle
              checked={notifications.responses}
              onChange={(v) => setNotifications({ ...notifications, responses: v })}
              label="Responses to my requests"
              description="Notify me when someone responds or accepts a job."
            />
            <Toggle
              checked={notifications.community}
              onChange={(v) => setNotifications({ ...notifications, community: v })}
              label="Community alerts"
              description="Neighborhood alerts: water cuts, power outages, meetings."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <form onSubmit={handleSubmit(onChangePassword)} className="mt-4 space-y-4 noValidate">
            <div>
              <label className="block text-sm font-medium text-foreground">Current password</label>
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
              <label className="block text-sm font-medium text-foreground">New password</label>
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
              <label className="block text-sm font-medium text-foreground">Confirm new password</label>
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
              {isSubmitting ? "Changing..." : "Change password"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
          <div className="mt-3 divide-y divide-border">
            <Toggle
              checked={preferences.showOnline}
              onChange={(v) => setPreferences({ ...preferences, showOnline: v })}
              label="Show online status"
              description="Let other neighbors see if you're available."
            />
            <Toggle
              checked={preferences.showNeighborhood}
              onChange={(v) => setPreferences({ ...preferences, showNeighborhood: v })}
              label="Show my neighborhood"
              description="Your neighborhood is visible on your requests and responses."
            />
            <Toggle
              checked={preferences.anonymousSearch}
              onChange={(v) => setPreferences({ ...preferences, anonymousSearch: v })}
              label="Incognito mode"
              description="Browse the community without appearing in the neighbors directory."
            />
          </div>
          <div className="mt-4 rounded-xl bg-muted-light px-4 py-3 text-xs text-muted">
            Your information is only visible to people in your area. We never share your data
            with third parties.
          </div>
        </section>
      </div>
    </div>
  );
}