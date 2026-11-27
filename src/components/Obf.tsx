"use client";

import { useEffect, useState } from "react";

/**
 * A phone number put together in the browser after the page loads, so it
 * never sits in the HTML for spam scrapers to harvest. `as="sms"` makes a
 * text-message link.
 */
export function Obf({
  b64,
  as = "tel",
  className = "",
  fallback = "Call the church office",
}: {
  b64: string;
  as?: "tel" | "sms";
  className?: string;
  fallback?: string;
}) {
  const [digits, setDigits] = useState<string | null>(null);
  useEffect(() => setDigits(atob(b64)), [b64]);
  if (!digits) return <span className={className}>{fallback}</span>;
  const pretty = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return (
    <a href={`${as}:+1${digits}`} className={className}>
      {pretty}
    </a>
  );
}

/** An email address, kept out of the page source the same way. */
export function ObfEmail({ b64, className = "" }: { b64: string; className?: string }) {
  const [addr, setAddr] = useState<string | null>(null);
  useEffect(() => setAddr(atob(b64)), [b64]);
  if (!addr) return <span className={className}>Email</span>;
  return (
    <a href={`mailto:${addr}`} className={className}>
      {addr}
    </a>
  );
}
