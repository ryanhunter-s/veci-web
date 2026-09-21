"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <p style={{ color: "#666", marginTop: 8 }}>{error?.message || "An unexpected error occurred."}</p>
          <button onClick={() => reset()} style={{ marginTop: 12, padding: "6px 12px", border: "1px solid #ccc", borderRadius: 4 }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
