"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { LogoMark } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid credentials. Check your email and password.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1 text-muted">Sign in to keep helping your neighbors.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 noValidate">
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
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-danger">{errors.password.message}</p>
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
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
          <p className="text-center text-muted">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}