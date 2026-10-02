"use client";

import { useRouter } from "next/navigation";
import { IconLogo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, MailCheck, MessageSquareText } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export type OtpChannel = "email" | "phone";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

const VERIFY_ENDPOINTS: Record<OtpChannel, string> = {
  email: "/api/auth/verify-email",
  phone: "/api/auth/verify-phone",
};

const COPY: Record<OtpChannel, { title: string; lead: string; cta: string; Icon: typeof MailCheck }> = {
  email: {
    title: "Verify your email",
    lead: "We sent a 6-digit code to",
    cta: "Verify email",
    Icon: MailCheck,
  },
  phone: {
    title: "Verify your phone",
    lead: "We sent a 6-digit code by SMS or WhatsApp to",
    cta: "Verify phone",
    Icon: MessageSquareText,
  },
};

function emptyDigits(): string[] {
  return Array<string>(CODE_LENGTH).fill("");
}

export interface OtpVerifyFormProps {
  userId: string;
  channel: OtpChannel;
  target: string;
  nextPath: string;
}

export default function OtpVerifyForm({ userId, channel, target, nextPath }: OtpVerifyFormProps) {
  const router = useRouter();
  const { title, lead, cta, Icon } = COPY[channel];
  const [digits, setDigits] = useState<string[]>(emptyDigits);
  const [status, setStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const autoSubmitted = useRef(false);

  const code = digits.join("");
  const isComplete = code.length === CODE_LENGTH;
  const busy = status !== "idle";

  useEffect(() => {
    if (status !== "idle" || cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown, status]);

  const focusBox = useCallback((index: number) => {
    const box = boxes.current[Math.min(Math.max(index, 0), CODE_LENGTH - 1)];
    box?.focus();
    box?.select();
  }, []);

  const resetCode = useCallback(
    (index = 0) => {
      autoSubmitted.current = false;
      setDigits(emptyDigits());
      focusBox(index);
    },
    [focusBox],
  );

  const verify = useCallback(
    async (value: string) => {
      setStatus("verifying");
      setError(null);
      setNotice(null);

      try {
        const res = await fetch(VERIFY_ENDPOINTS[channel], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, otp: value }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.message ?? "We could not verify that code.");
          resetCode();
          return;
        }

        setStatus("verified");
        router.push(nextPath);
        router.refresh();
      } catch {
        setError("Network error. Check your connection and try again.");
      } finally {
        setStatus((current) => (current === "verifying" ? "idle" : current));
      }
    },
    [channel, userId, nextPath, router, resetCode],
  );

  const spread = useCallback(
    (index: number, incoming: string) => {
      const incomingDigits = incoming.replace(/\D/g, "");
      if (!incomingDigits) return;

      const merged = [...digits.slice(0, index), ...incomingDigits].slice(0, CODE_LENGTH);
      setDigits(merged);
      autoSubmitted.current = true;
      focusBox(Math.min(index + incomingDigits.length, CODE_LENGTH - 1));

      const mergedCode = merged.join("");
      if (mergedCode.length === CODE_LENGTH) {
        void verify(mergedCode);
      }
    },
    [digits, focusBox, verify],
  );

  function handleChange(index: number, raw: string) {
    if (busy) return;

    const incoming = raw.replace(/\D/g, "");

    if (!incoming) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (incoming.length > 1) {
      spread(index, incoming);
      return;
    }

    const next = [...digits];
    next[index] = incoming;
    setDigits(next);

    if (index < CODE_LENGTH - 1) focusBox(index + 1);

    const nextCode = next.join("");
    if (nextCode.length === CODE_LENGTH && !autoSubmitted.current) {
      autoSubmitted.current = true;
      void verify(nextCode);
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }
      if (index > 0) {
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusBox(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusBox(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  function handlePaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    if (busy) return;
    spread(index, event.clipboardData.getData("text"));
  }

  async function handleResend() {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, channel }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message ?? "We could not send a new code.");
        return;
      }

      setCooldown(RESEND_COOLDOWN_SECONDS);
      setNotice(data.message ?? "We sent you a new code. It expires in 10 minutes.");
      resetCode();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <Button variant="ghost" size="lg" onClick={() => router.back()} className="w-fit text-muted-foreground">
        <ArrowLeft />
        Go back
      </Button>

      <div className="mt-6 text-center">
        <div className="mx-auto h-20 w-20">
          <IconLogo />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">
          {lead} <span className="font-medium text-primary">{target}</span>
        </p>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!isComplete || busy) return;
          autoSubmitted.current = true;
          void verify(code);
        }}
        className="mt-8"
      >
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={`otp-${channel}-0`}>Verification code</FieldLabel>
          <div className="grid grid-cols-6 gap-2">
            {digits.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${channel}-${index}`}
                ref={(node) => {
                  boxes.current[index] = node;
                }}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                onFocus={(event) => event.currentTarget.select()}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={CODE_LENGTH}
                disabled={busy}
                aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                className="h-14 px-1 text-center text-xl font-bold tabular-nums md:text-xl"
              />
            ))}
          </div>
          <FieldError>{error}</FieldError>
          <FieldDescription>
            {notice ?? "The code expires in 10 minutes. In this demo it is printed in the terminal."}
          </FieldDescription>
        </Field>

        <Button type="submit" size="xl" disabled={!isComplete || busy} className="mt-6 w-full rounded-full">
          {status === "verifying" ? (
            <>
              <Loader2 className="animate-spin" /> Verifying...
            </>
          ) : status === "verified" ? (
            <>
              <Icon /> Verified
            </>
          ) : (
            cta
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{" "}
        {cooldown > 0 ? (
          <span className="tabular-nums">Resend in 0:{String(cooldown).padStart(2, "0")}</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline disabled:opacity-60"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </p>
    </div>
  );
}
