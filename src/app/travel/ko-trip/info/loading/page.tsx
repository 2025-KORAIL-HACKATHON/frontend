"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

export default function KoTripInfoLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (progress < 100) {
      v.loop = true;
      const pp = v.play();
      if (pp) pp.catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [progress]);

  useEffect(() => {
    if (progress !== 100) return;
    const t = setTimeout(
      () => router.replace("/travel/ko-trip/info/generate"),
      600
    );
    return () => clearTimeout(t);
  }, [progress, router]);

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="p-6 bg-white min-h-full">
        <h1 className="text-xl font-bold">
          당신을 위한 AI 모집글을 생성하는 중이에요!
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          답변하신 문항들로 코레일톡이 AI 모집글을 생성하고 있어요.
          <br />
          나만의 여행 메이트를 찾기 위해 잠시만 기다려주세요!
        </p>

        <div className="mt-10 h-64 rounded-3xl bg-sky-100 overflow-hidden">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/videos/recommend-loading.mp4"
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
          />
        </div>

        <div className="mt-8 text-center font-bold">{progress}%</div>
        <div className="mt-2 h-2 rounded-full bg-neutral-200">
          <div
            className="h-2 rounded-full bg-sky-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </MobileFrame>
  );
}
