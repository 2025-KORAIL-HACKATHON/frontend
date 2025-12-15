"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRecommendStore } from "@/stores/recommendStore";
import { ItineraryDay } from "@/types/recommend";
import { ALL_PACKAGES } from "@/data/packages";

function periodToDays(period: string) {
  if (period === "당일") return 1;
  if (period === "1박2일") return 2;
  if (period === "2박3일") return 3;
  if (period === "3박4일") return 4;
  return 5;
}

function makeItinerary(
  days: number,
  region: string,
  purposes: string[]
): ItineraryDay[] {
  const slots = [
    { time: "09:00", title: "아침 이동", desc: `${region} 이동 및 체크인` },
    {
      time: "11:00",
      title: "핵심 스팟",
      desc: purposes[0] ? `${purposes[0]} 테마 장소 방문` : "추천 명소 방문",
    },
    { time: "13:00", title: "점심", desc: "로컬 맛집 추천" },
    {
      time: "15:00",
      title: "체험/산책",
      desc: purposes[1] ? `${purposes[1]} 기반 코스` : "산책/카페",
    },
    { time: "18:00", title: "저녁", desc: "저녁 식사 및 야경" },
  ];

  return Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    items: slots.map((s) => ({
      ...s,
      title: `${s.title} (DAY ${i + 1})`,
    })),
  }));
}

export default function RecommendLoadingPage() {
  const router = useRouter();
  const { input, setItinerary, setMatchedPackages } = useRecommendStore();
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const safeInput = useMemo(() => input, [input]);

  useEffect(() => {
    if (!safeInput) {
      router.replace("/travel/recommend/input");
      return;
    }

    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 80);

    return () => clearInterval(id);
  }, [safeInput, router]);

  // progress에 따라 영상 재생/정지 제어
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (progress < 100) {
      // 자동재생 정책 대응: muted + playsInline 필요
      v.loop = true;
      const playPromise = v.play();
      // safari/모바일에서 play()가 reject 될 수 있어 무시 처리
      if (playPromise) playPromise.catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0; // 끝나면 첫 프레임으로
    }
  }, [progress]);

  useEffect(() => {
    if (!safeInput) return;
    if (progress !== 100) return;

    if (safeInput.travelType === "FREE") {
      const days = periodToDays(safeInput.period);
      const plan = makeItinerary(days, safeInput.region1, safeInput.purposes);
      setItinerary(plan);
    } else {
      const matched = ALL_PACKAGES.map((p) => {
        let score = 0;
        if (p.region === safeInput.region1) score += 3;
        if (p.period === safeInput.period) score += 2;
        score += p.purposes.filter((x) =>
          safeInput.purposes.includes(x)
        ).length;
        return { p, score };
      })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p);

      setMatchedPackages(matched);
    }

    const t = setTimeout(() => {
      router.replace(
        safeInput.travelType === "FREE"
          ? "/travel/recommend/itinerary"
          : "/travel/recommend/packages"
      );
    }, 1200);

    return () => clearTimeout(t);
  }, [progress, safeInput, router, setItinerary, setMatchedPackages]);

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="p-6 bg-white min-h-full">
        <h1 className="text-xl font-bold">
          당신의 여행 취향을 분석하는 중이에요!
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          답변하신 문항들로 코레일톡이 취향을 분석하는 중입니다. 잠시만
          기다려주세요!
        </p>

        {/* 기존 박스에 mp4 삽입 */}
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
