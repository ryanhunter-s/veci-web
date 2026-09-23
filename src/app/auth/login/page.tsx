"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { LogoMark } from "@/components/Logo";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3a7.16 7.16 0 0 1-10.68-3.75H1.3v3.09A11.98 11.98 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.39 14.34a7.2 7.2 0 0 1 0-4.68V6.57H1.3a12 12 0 0 0 0 10.86l4.09-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.84c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.83 11.83 0 0 0 12 0 11.98 11.98 0 0 0 1.3 6.57l4.09 3.09A7.15 7.15 0 0 1 12 4.84Z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);

  const googleError = searchParams.get("error");

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

  async function onGoogleSignIn() {
    setGooglePending(true);
    const callbackUrl = searchParams.get("callbackUrl");
    await signIn("google", {
      callbackUrl:
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard",
    });
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
        {googleError && !serverError && (
          <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {googleError === "AccessDenied" || googleError === "Configuration"
              ? "Google sign-in is not configured yet. Try with your email and password."
              : "Google sign-in failed. Please try again."}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted">
            <span className="bg-background px-2">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={googlePending}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-card-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon className="h-5 w-5" />
          {googlePending ? "Redirecting to Google..." : "Continue with Google"}
        </button>

        <Link
          href="/auth/register"
          className="block w-full rounded-full border border-border bg-card px-6 py-3 text-center text-base font-semibold text-foreground hover:bg-card-hover transition-colors"
        >
          Create an account
        </Link>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:text-primary-hover">
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