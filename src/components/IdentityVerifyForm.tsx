"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, ShieldCheck, Upload, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import type { IdentityDocType } from "@/lib/users";

type DocType = IdentityDocType;

const MAX_DOC_SIZE_BYTES = 3 * 1024 * 1024;

const DOC_TYPES: { value: DocType; label: string; hint: string; placeholder: string }[] = [
  {
    value: "national_id",
    label: "National ID",
    hint: "National ID card",
    placeholder: "e.g. 1234 56789 0101",
  },
  {
    value: "passport",
    label: "Passport",
    hint: "Valid passport",
    placeholder: "e.g. A12345678",
  },
  {
    value: "drivers_license",
    label: "Driver's License",
    hint: "Valid driving license",
    placeholder: "e.g. D12345678",
  },
  {
    value: "residence_permit",
    label: "Residence Permit",
    hint: "Valid residence permit",
    placeholder: "e.g. RP-1234567",
  },
];

interface FormErrors {
  docNumber?: string;
  file?: string;
  form?: string;
}

export interface IdentityVerifyFormProps {
  userId: string;
  onDone?: () => void | Promise<void>;
  nextPath?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IdentityVerifyForm({ userId, onDone, nextPath = "/dashboard" }: IdentityVerifyFormProps) {
  const router = useRouter();
  const [docType, setDocType] = useState<DocType | "">("");
  const [docNumber, setDocNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!docType) next.form = "Select a document type.";
    if (docNumber.trim().length < 6) next.docNumber = "Enter a valid document number.";
    if (!file) next.file = "Please upload a photo of your document.";
    else if (file.size > MAX_DOC_SIZE_BYTES) next.file = "The document photo must be under 3 MB.";

    return next;
  }

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setErrors((prev) => ({ ...prev, file: undefined, form: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle" || !file) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("submitting");
    setErrors({});

    try {
      const body = new FormData();
      body.append("docType", docType);
      body.append("docNumber", docNumber.trim());
      body.append("file", file);

      const res = await fetch("/api/auth/verify-identity", {
        method: "POST",
        body,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors({ form: data.message ?? "We could not upload your document." });
        return;
      }

      setStatus("done");
      if (onDone) {
        await onDone();
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch {
      setErrors({ form: "Network error. Check your connection and try again." });
    } finally {
      setStatus((current) => (current === "submitting" ? "idle" : current));
    }
  }

  const busy = status !== "idle";
  const activeType = DOC_TYPES.find((d) => d.value === docType);
  const inputId = "docNumber";

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <Field>
        <FieldTitle>Document type</FieldTitle>
        <div className="grid grid-cols-2 gap-3">
          {DOC_TYPES.map((option) => {
            const selected = docType === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-0.5 rounded-xl border px-4 py-3 transition-colors",
                  "has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-3",
                  selected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40",
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="docType"
                    value={option.value}
                    checked={selected}
                    onChange={() => {
                      setDocType(option.value);
                      setErrors((prev) => ({ ...prev, form: undefined }));
                    }}
                    disabled={busy}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </span>
                <span className="pl-6 text-xs text-muted-foreground">{option.hint}</span>
              </label>
            );
          })}
        </div>
        {errors.form && <FieldError>{errors.form}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.docNumber}>
        <FieldLabel htmlFor={inputId}>Document number</FieldLabel>
        <Input
          id={inputId}
          value={docNumber}
          onChange={(event) => {
            setDocNumber(event.target.value);
            setErrors((prev) => ({ ...prev, docNumber: undefined }));
          }}
          disabled={busy}
          autoComplete="off"
          placeholder={activeType?.placeholder ?? "e.g. 1234 56789 0101"}
          className="h-11"
        />
        <FieldDescription>Exactly as it appears on the document.</FieldDescription>
        <FieldError>{errors.docNumber}</FieldError>
      </Field>

      <Field data-invalid={!!errors.file}>
        <FieldTitle>Document photo</FieldTitle>
        <label
          htmlFor="docPhoto"
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
            "hover:border-primary focus-within:border-primary",
            errors.file && "border-destructive",
          )}
        >
          {preview ? (
            <>
              <img src={preview} alt="Document preview" className="max-h-48 rounded-lg object-contain" />
              <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                {file?.name} · {formatBytes(file?.size ?? 0)}
              </span>
            </>
          ) : (
            <>
              <Upload className="size-6 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {file ? file.name : "Click to upload a photo of your document"}
              </span>
              <span className="text-xs text-muted-foreground">JPG or PNG, up to 3 MB</span>
            </>
          )}
        </label>
        <input
          id="docPhoto"
          type="file"
          accept="image/*"
          disabled={busy}
          className="sr-only"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => handleFileChange(null)}
            className="w-fit text-muted-foreground"
          >
            <X /> Remove file
          </Button>
        )}
        <FieldError>{errors.file}</FieldError>
      </Field>

      <Button type="submit" size="xl" disabled={busy} className="w-full rounded-full">
        {status === "submitting" ? (
          <>
            <Loader2 className="animate-spin" /> Uploading...
          </>
        ) : status === "done" ? (
          <><ShieldCheck /> Verified</>
        ) : (
          "Finish verification"
        )}
      </Button>
    </form>
  );
}
