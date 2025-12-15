"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

type MateSlide = {
  img: string;
  title: string;
  desc: string;
};

export default function MatePostCarousel({
  slides,
  height = 260, // 카드 전체 높이(이미지+텍스트)
  slideBasis = 0.86,
  speedPxPerSec = 35,
}: {
  slides: MateSlide[];
  height?: number;
  slideBasis?: number;
  speedPxPerSec?: number;
}) {
  // 2세트로 이어붙여서 무한루프
  const loop = useMemo(() => [...slides, ...slides], [slides]);

  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

  const slideWidthRef = useRef(0);

  const tick = (ts: number) => {
    const track = trackRef.current;
    if (!track) return;

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

    track.style.transform = `translateX(${xRef.current}px)`;
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // 첫 슬라이드 width(+gap) 기준으로 loopWidth 계산
    const first = track.children[0] as HTMLElement | undefined;
    if (first) slideWidthRef.current = first.offsetWidth + 12; // gap-3(12px)

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
        trackRef.current!.style.transform = `translateX(${xRef.current}px)`;
      }}
      onPointerUp={() => (draggingRef.current = false)}
      onPointerLeave={() => (draggingRef.current = false)}
    >
      <div ref={trackRef} className="flex gap-3 px-1 will-change-transform">
        {loop.map((s, idx) => (
          <article
            key={`${s.title}-${idx}`}
            className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm"
            style={{
              height,
              flex: `0 0 ${slideBasis * 100}%`,
            }}
          >
            {/* 위: 이미지 */}
            <div className="relative w-full h-37.5 bg-neutral-200">
              <Image
                src={s.img}
                alt={s.title}
                fill
                className="object-cover"
                sizes="(max-width: 480px) 85vw, 520px"
                priority={idx < slides.length}
              />
            </div>

            {/* 아래: 제목 + 내용 */}
            <div className="p-4">
              <div className="text-base font-extrabold">{s.title}</div>
              <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                {s.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
