"use client";

import { useEffect, useRef } from "react";

/** Writes the scroll position into --sy so the ridges can drift at different speeds. */
export default function Parallax({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 1200);
        el.current?.style.setProperty("--sy", String(y));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
}
