"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterValues } from "@/lib/schemas";
import { IconLogo } from "@/components/Logo";
import { Check } from "lucide-react";

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

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

    setPendingUser(data as PendingUser);
    setStep("email");
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

  function renderSteps() {
    return (
      <ol className="mt-8 flex items-center justify-center gap-2" aria-label="Registration steps">
        {steps.map((s, i) => {
          const isDone = done.includes(s.key);
          const isCurrent = step === s.key;
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isDone
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "border-2 border-primary text-primary"
                      : "border border-border text-muted"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {i < steps.length - 1 && <span className="h-px w-6 bg-border" />}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      {renderHeader()}
      {renderSteps()}

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
                <option value="">Select…</option>
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

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <input
              type="checkbox"
              checked={watch("captcha") === true}
              onChange={(e) =>
                setValue("captcha", e.target.checked as true, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <div>
              <span className="block text-sm font-medium text-foreground">I am not a robot</span>
              <span className="block text-xs text-muted">
                Demo captcha (no external service). Real CAPTCHA comes later.
              </span>
            </div>
          </label>
          {errors.captcha && <p className="text-sm text-danger">{errors.captcha.message}</p>}

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
      )}

      {step === "email" && pendingUser && (
        <OtpStep
          title="Verify your email"
          description={`We sent a 6-digit code to ${pendingUser.email}. In this demo the code is printed in the terminal where you run next dev.`}
          channel="email"
          userId={pendingUser.id}
          onVerified={() => {
            setPendingUser({ ...pendingUser, emailVerified: true });
            setStep("phone");
          }}
        />
      )}

      {step === "phone" && pendingUser && (
        <OtpStep
          title="Verify your phone"
          description={`We sent a 6-digit code by SMS/WhatsApp to ${pendingUser.phoneNumber}. In this demo the code is printed in the terminal where you run next dev.`}
          channel="phone"
          userId={pendingUser.id}
          onVerified={() => {
            setPendingUser({ ...pendingUser, phoneVerified: true });
            setStep("identity");
          }}
        />
      )}

      {step === "identity" && pendingUser && (
        <IdentityStep
          userId={pendingUser.id}
          onDone={async () => {
            const creds = credentialsRef.current;
            if (creds) {
              await signIn("credentials", {
                email: creds.email,
                password: creds.password,
                redirect: false,
              });
            }
            router.push("/");
            router.refresh();
          }}
        />
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

function OtpStep({
  title,
  description,
  channel,
  userId,
  onVerified,
}: {
  title: string;
  description: string;
  channel: "email" | "phone";
  userId: string;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit() {
    setError(null);
    setNotice(null);
    setSending(true);
    try {
      const res = await fetch(
        channel === "email" ? "/api/auth/verify-email" : "/api/auth/verify-phone",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, otp }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Could not verify the code.");
        return;
      }
      onVerified();
    } finally {
      setSending(false);
    }
  }

  async function resend() {
    setError(null);
    setNotice(null);
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, channel }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Could not resend the code.");
      return;
    }
    setNotice(data.message);
  }

  return (
    <div className="mt-8 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <div>
        <label htmlFor={`otp-${channel}`} className="block text-sm font-medium text-foreground">
          Verification code
        </label>
        <input
          id={`otp-${channel}`}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-lg tracking-[0.5em] text-foreground placeholder:text-muted placeholder:tracking-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
        {notice && <p className="mt-1.5 text-sm text-muted">{notice}</p>}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={otp.length !== 6 || sending}
        className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? "Verifying..." : "Verify"}
      </button>

      <p className="text-center text-sm text-muted">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          onClick={resend}
          className="font-medium text-primary hover:text-primary-hover"
        >
          Resend code
        </button>
      </p>
    </div>
  );
}

function IdentityStep({
  userId,
  onDone,
}: {
  userId: string;
  onDone: () => void;
}) {
  const [docType, setDocType] = useState<"dpi" | "passport" | "">("");
  const [docNumber, setDocNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit() {
    setError(null);
    if (!docType) {
      setError("Select a document type.");
      return;
    }
    if (!file) {
      setError("Upload a photo of your document.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("The document photo must be under 3 MB.");
      return;
    }

    const docContent = await fileToDataUrl(file);
    setSending(true);
    try {
      const res = await fetch("/api/auth/verify-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, docType, docNumber, fileName: file.name, docContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Could not upload the document.");
        return;
      }
      onDone();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Validate your identity</h2>
        <p className="mt-1 text-sm text-muted">
          Upload a photo of your government-issued ID (DPI or passport). In this demo the document
          is stored in memory only — in production it is uploaded to protected storage and reviewed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <input
            type="radio"
            name="docType"
            value="dpi"
            checked={docType === "dpi"}
            onChange={() => setDocType("dpi")}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium text-foreground">DPI</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <input
            type="radio"
            name="docType"
            value="passport"
            checked={docType === "passport"}
            onChange={() => setDocType("passport")}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium text-foreground">Passport</span>
        </label>
      </div>

      <div>
        <label htmlFor="docNumber" className="block text-sm font-medium text-foreground">
          Document number
        </label>
        <input
          id="docNumber"
          type="text"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          placeholder={docType === "passport" ? "e.g. 123456789" : "e.g. 1234 56789 0101"}
          className="mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="idPhoto"
          className="block cursor-pointer rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center transition-colors hover:border-primary"
        >
          {preview ? (
            <img src={preview} alt="Document preview" className="mx-auto max-h-48 rounded-lg" />
          ) : file ? (
            <span className="text-sm font-medium text-foreground">{file.name}</span>
          ) : (
            <span className="text-sm text-muted">
              Click to upload a photo of your document (JPG/PNG, max 3 MB)
            </span>
          )}
          <input
            id="idPhoto"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setFile(f);
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
        </label>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={sending || !docType || !docNumber || !file}
        className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? "Uploading..." : "Finish verification"}
      </button>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}