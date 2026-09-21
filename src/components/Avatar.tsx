import Image from "next/image";
import { avatarHue, initialsOf } from "@/utils/workers";

function PaletteAvatar({ name, size }: { name: string; size: number }) {
  const hue = avatarHue(name);
  const gid = `av-${hue}-${size}`;
  const wrapId = `avw-${hue}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={name}
      className="shrink-0 rounded-full"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue}, 52%, 48%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 40) % 360}, 58%, 36%)`} />
        </linearGradient>
        <clipPath id={wrapId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${gid})`} />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        clipPath={`url(#${wrapId})`}
        fill="#ffffff"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="24"
        fontWeight="700"
      >
        {initialsOf(name)}
      </text>
    </svg>
  );
}

export default function Avatar({
  name,
  photo,
  size = 48,
}: {
  name: string;
  photo?: string | null;
  size?: number;
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return <PaletteAvatar name={name} size={size} />;
}