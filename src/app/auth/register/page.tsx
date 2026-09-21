"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterValues } from "@/lib/schemas";
import { LogoMark } from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterValues) {
    setServerError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        neighborhood: values.neighborhood,
      }),
    });
    
    console.log(res);
    if (!res.ok) {
      const data = await res.json();
      setServerError(data.message ?? "Something went wrong while creating your account.");
      return;
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
          Join Veci
        </h1>
        <p className="mt-1 text-muted">
          Connect with your community and help each other out.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 noValidate">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Maria Garcia"
            {...register("name")}
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {errors.name && <p className="mt-1.5 text-sm text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            {...register("email")}
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {errors.email && <p className="mt-1.5 text-sm text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-foreground">
            Neighborhood
          </label>
          <input
            id="neighborhood"
            type="text"
            placeholder="e.g. Centro, Las Parcelas, San Miguel"
            {...register("neighborhood")}
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {errors.neighborhood && (
            <p className="mt-1.5 text-sm text-danger">{errors.neighborhood.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters, a capital letter, and a number"
            {...register("password")}
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating your account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}