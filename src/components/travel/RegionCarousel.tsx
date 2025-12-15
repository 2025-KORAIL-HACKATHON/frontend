"use client";

import Image from "next/image";

type Slide = {
  src: string;
  label: string;
};

export default function RegionCarousel({
  slides,
  height = 190, // 더 크게
  durationSec = 18, // 더 빠르게 (작을수록 빠름)
}: {
  slides: Slide[];
  height?: number;
  durationSec?: number;
}) {
  const loop = [...slides, ...slides];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className="rc-track" style={{ ["--dur" as any]: `${durationSec}s` }}>
        {loop.map((s, idx) => (
          <div
            key={`${s.label}-${idx}`}
            className="rc-slide relative overflow-hidden rounded-2xl bg-neutral-200"
            style={{ height }}
          >
            <Image
              src={s.src}
              alt={s.label}
              fill
              sizes="(max-width: 480px) 92vw, 420px"
              className="object-cover"
              priority={idx < slides.length}
            />

            {/* 아래쪽 그라데이션 + 라벨 */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute left-4 bottom-4 text-white font-black text-xl drop-shadow">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .rc-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: rc-scroll var(--dur) linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        /* 사진을 더 넓게: 거의 한 장이 화면을 채움 */
        .rc-slide {
          flex: 0 0 150%;
        }

        @keyframes rc-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rc-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
