export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US");
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "your email";

  const at = trimmed.indexOf("@");
  if (at <= 0) return trimmed;

  const name = trimmed.slice(0, at);
  const visible = name.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(name.length - 1, 1))}${trimmed.slice(at)}`;
}

export function maskPhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "your phone";

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length <= 4) return trimmed;

  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export function formatSchedule(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}