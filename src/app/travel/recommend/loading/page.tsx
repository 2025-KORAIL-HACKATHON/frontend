"use client";

import { useEffect, useMemo, useState } from "react";
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
  return 5; // 4박이상은 5일로 보여주기(샘플)
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

  useEffect(() => {
    if (!safeInput) return;
    if (progress !== 100) return;

    // 결과 계산/저장
    if (safeInput.travelType === "FREE") {
      const days = periodToDays(safeInput.period);
      const plan = makeItinerary(days, safeInput.region1, safeInput.purposes);
      setItinerary(plan);
    } else {
      // 간단 매칭 점수
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

        <div className="mt-10 h-64 rounded-3xl bg-sky-100" />

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
