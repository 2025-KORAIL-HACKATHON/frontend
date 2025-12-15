"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = { src: string; label: string };

export default function RegionCarousel({
  slides,
  height = 190,
  slideBasis = 0.8,
  speedPxPerSec = 50,
}: {
  slides: Slide[];
  height?: number;
  slideBasis?: number;
  speedPxPerSec?: number;
}) {
  // 2세트만 있으면 충분 (transform 기반)
  const loop = useMemo(() => [...slides, ...slides], [slides]);

  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

  const slideWidthRef = useRef(0);

  /** 자동 이동 */
  const tick = (ts: number) => {
    if (!trackRef.current) return;

    const last = lastTsRef.current ?? ts;
    const dt = Math.min(50, ts - last);
    lastTsRef.current = ts;

    if (!draggingRef.current) {
      xRef.current -= (speedPxPerSec * dt) / 1000;
    }

    const loopWidth = slideWidthRef.current * slides.length;
    if (loopWidth > 0 && Math.abs(xRef.current) >= loopWidth) {
      xRef.current += loopWidth;
    }

    trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const stop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // 첫 슬라이드 기준 폭 계산
    const first = el.children[0] as HTMLElement | undefined;
    if (first) {
      slideWidthRef.current = first.offsetWidth + 16; // gap 포함
    }

    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden touch-pan-x"
      onPointerDown={(e) => {
        draggingRef.current = true;
        lastXRef.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        xRef.current += dx;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${xRef.current}px)`;
        }
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerLeave={() => {
        draggingRef.current = false;
      }}
    >
      <div ref={trackRef} className="flex gap-4 px-2 will-change-transform">
        {loop.map((s, idx) => (
          <div
            key={`${s.label}-${idx}`}
            className="relative bg-neutral-200 overflow-hidden"
            style={{
              height,
              flex: `0 0 ${slideBasis * 100}%`,
            }}
          >
            <Image
              src={s.src}
              alt={s.label}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 480px) 92vw, 520px"
              priority={idx < slides.length}
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute left-4 bottom-4 text-white text-xl font-black drop-shadow">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
