"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterValues } from "@/lib/schemas";
import { IconLogo } from "@/components/Logo";
import IdentityVerifyForm from "@/components/IdentityVerifyForm";
import { Check } from "lucide-react";
import OtpVerifyForm from "@/components/OtpVerifyForm";
import { maskEmail, maskPhone } from "@/utils/format";
import { signIn } from "next-auth/react";

type Step = "profile" | "email" | "phone" | "identity";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
}

const steps: { key: Step; label: string }[] = [
  { key: "profile", label: "Account" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "identity", label: "ID document" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile");
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const credentialsRef = useRef<{ email: string; password: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const [serverError, setServerError] = useState<string | null>(null);

  function doneSteps(): Step[] {
    const done: Step[] = ["profile"];
    if (pendingUser?.emailVerified) done.push("email");
    if (pendingUser?.phoneVerified) done.push("phone");
    if (pendingUser?.identityVerified) done.push("identity");
    return done;
  }

  const done = doneSteps();

  async function onSubmitProfile(values: RegisterValues) {
    setServerError(null);
    credentialsRef.current = { email: values.email, password: values.password };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) {
      setServerError(data.message ?? "Something went wrong while creating your account.");
      return;
    }

    const rest = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    router.push("/dashboard");
  }

  function renderHeader() {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center">
          <IconLogo />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Join Veci</h1>
        <p className="mt-1 text-muted">
          {step === "profile"
            ? "Connect with your community and help each other out."
            : "Verify your identity so your neighbors can trust you."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      {renderHeader()}

      {step === "profile" && (
        <form onSubmit={handleSubmit(onSubmitProfile)} className="mt-8 space-y-5 noValidate">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Maria"
                {...register("firstName")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.firstName && (
                <p className="mt-1.5 text-sm text-danger">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Garcia"
                {...register("lastName")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.lastName && (
                <p className="mt-1.5 text-sm text-danger">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                Phone number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="+502 5555 5555"
                {...register("phoneNumber")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <p className="mt-1 text-xs text-muted">
                We send a confirmation code by WhatsApp / SMS.
              </p>
              {errors.phoneNumber && (
                <p className="mt-1.5 text-sm text-danger">{errors.phoneNumber.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-foreground">
                Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="mt-1.5 text-sm text-danger">{errors.gender.message}</p>}
            </div>
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
            <p className="mt-1 text-xs text-muted">We send a confirmation code by email.</p>
            {errors.email && <p className="mt-1.5 text-sm text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth")}
              className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <p className="mt-1 text-xs text-muted">You must be at least 18 years old to join.</p>
            {errors.dateOfBirth && (
              <p className="mt-1.5 text-sm text-danger">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-foreground">
              Address / zone
            </label>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              placeholder="e.g. Av. Reforma, Zona 10"
              {...register("address")}
              className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <p className="mt-1 text-xs text-muted">
              We use this only to show you the closest jobs. Your exact address is never public.
            </p>
            {errors.address && (
              <p className="mt-1.5 text-sm text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="Guatemala"
                {...register("city")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.city && <p className="mt-1.5 text-sm text-danger">{errors.city.message}</p>}
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-foreground">
                ZIP / postal code
              </label>
              <input
                id="zip"
                type="text"
                autoComplete="postal-code"
                placeholder="01010"
                {...register("zip")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.zip && <p className="mt-1.5 text-sm text-danger">{errors.zip.message}</p>}
            </div>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="8+ chars, A and 0-9"
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
                placeholder="Repeat it"
                {...register("confirmPassword")}
                className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-danger">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full mt-10 bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating your account..." : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}