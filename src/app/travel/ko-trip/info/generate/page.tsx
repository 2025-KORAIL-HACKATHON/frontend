"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

const KO_TRIP_STEP1_KEY = "korail.koTripStep1.v1";
const KO_TRIP_STEP2_KEY = "korail.koTripStep2.v1";
const KO_TRIP_CREATED_KEY = "korail.koTripCreatedOnce.v1";

type Step1 = {
  startDate: string;
  endDate: string;
  region: string;
  purpose: string;
  budget: string;
  intensity: string;
  people: string;
  mateTypes: string[];
};

type Step2 = {
  gender: string;
  age: string;
  mbti: string;
  wake: string;
  food: string;
  etc: string[];
};

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function IconBack() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDatePretty(yyyyMMdd: string) {
  // "2025-12-14" -> "25.12.14"
  if (!yyyyMMdd) return "";
  const [y, m, d] = yyyyMMdd.split("-");
  if (!y || !m || !d) return yyyyMMdd;
  return `${y.slice(2)}.${m}.${d}`;
}

function nightsDaysText(start: string, end: string) {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  // diff=1이면 1박2일
  const nights = Math.max(0, diff);
  const days = nights + 1;
  if (days <= 0) return "";
  return nights === 0 ? "당일" : `${nights}박 ${days}일`;
}

/**
 *  Step1.purpose(문구) -> 상단 대표 이미지 경로 매핑
 * - 아래 경로는 예시입니다. 프로젝트에 있는 실제 파일 경로로 바꿔주세요.
 * - 매핑에 없는 목적이면 fallback("/images/map-sample.png")로 표시됩니다.
 */
const PURPOSE_IMAGE_MAP: Record<string, string> = {
  "체험·액티비티": "/images/leisure.png",
  "문화·예술·역사": "/images/culture.png",
  "자연과 함께": "/images/nature.png",
  "여유롭게 힐링": "/images/cozy.png",
  "관광보다 먹방": "/images/visit.png",
  "쇼핑은 열정적으로": "/images/shopping.png",
  "여행지 느낌 물씬": "/images/vibe.png",
  "유명 관광지 필수": "/images/travel.png",
  "SNS 핫플": "/imagessns.png",
};

export default function KoTripGeneratePage() {
  const router = useRouter();

  const [step1, setStep1] = useState<Step1 | null>(null);
  const [step2, setStep2] = useState<Step2 | null>(null);
  const [authorComment, setAuthorComment] = useState("");

  //  마운트 후 localStorage에서 로드
  useEffect(() => {
    const s1 = readJSON<Step1>(KO_TRIP_STEP1_KEY);
    const s2 = readJSON<Step2>(KO_TRIP_STEP2_KEY);
    setStep1(s1);
    setStep2(s2);
  }, []);

  //  목적에 따라 상단 이미지 변경
  const heroSrc = useMemo(() => {
    const key = step1?.purpose?.trim() ?? "";
    return PURPOSE_IMAGE_MAP[key] ?? "/images/map-sample.jpg";
  }, [step1?.purpose]);

  const chips = useMemo(() => {
    if (!step1) return [];

    const periodText = nightsDaysText(step1.startDate, step1.endDate);
    return [
      {
        icon: "/icons/calendar.svg",
        label: `${formatDatePretty(step1.startDate)} ~ ${formatDatePretty(
          step1.endDate
        )} (${periodText})`,
      },
      { icon: "/icons/user.svg", label: step1.people ?? "" },
      { icon: "/icons/bolt.svg", label: step1.intensity ?? "" },
      { icon: "/icons/money.svg", label: step1.budget ?? "" },
      { icon: "/icons/pin.svg", label: step1.purpose ?? "" },
    ].filter((x) => x.label.trim().length > 0);
  }, [step1]);

  const onRegister = () => {
    localStorage.setItem(KO_TRIP_CREATED_KEY, "true");
    router.replace("/travel/ko-trip/info/done");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        {/* 헤더 */}
        <header className="shrink-0 px-4 pt-3 pb-3 bg-white">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <IconBack />
            </button>
            <div className="font-black">모집글 생성</div>
            <div className="w-10" />
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
          {/*  목적 기반 상단 이미지 박스 */}
          <div className="relative h-44 w-full overflow-hidden rounded-3xl bg-neutral-200">
            <Image
              src={heroSrc}
              alt={step1?.purpose ? `${step1.purpose} 이미지` : "map"}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-5 text-2xl font-black">동행 구인 글 제목</div>
          <div className="mt-1 text-sm text-neutral-700">
            여행 취향 선택을 취합해 AI가 써준 소개 내용 표시
          </div>

          {/* 칩 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 rounded-lg shadow px-3 py-2 text-xs text-neutral-800"
              >
                <Image src={c.icon} alt="" width={14} height={14} />
                {c.label}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-sm font-black">동행자 관련 정보</div>
            <div className="mt-2 rounded-2xl p-4 shadow text-sm text-neutral-600 min-h-20">
              {step2 ? (
                <>
                  성별: {step2.gender} / 연령대: {step2.age} / MBTI:{" "}
                  {step2.mbti}
                  <br />
                  기상: {step2.wake} / 음식: {step2.food}
                  {step2.etc?.length ? ` / 기타: ${step2.etc.join(", ")}` : ""}
                </>
              ) : (
                "Step2 데이터가 없습니다. (이전 페이지에서 '다음'을 눌러 저장되었는지 확인)"
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-black">작성자 관련 정보</div>
            <div className="mt-2 rounded-2xl p-4 text-sm shadow text-neutral-600 min-h-20">
              {step1 ? (
                <>
                  여행 지역: {step1.region}
                  <br />
                  동행 유형:{" "}
                  {step1.mateTypes?.length ? step1.mateTypes.join(", ") : "-"}
                  <br />
                  여행 목적: {step1.purpose}
                </>
              ) : (
                "Step1 데이터가 없습니다. (이전 페이지에서 '다음'을 눌러 저장되었는지 확인)"
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-black">작성자 코멘트</div>
            <textarea
              value={authorComment}
              onChange={(e) => setAuthorComment(e.target.value)}
              className="mt-2 w-full rounded-2xl p-4 text-sm min-h-24 shadow"
              placeholder="추가하고 싶은 말이 있다면 써주세요."
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 border-t bg-white px-5 py-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-1/2 h-12 rounded-2xl bg-neutral-200 text-neutral-700 font-bold cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="w-1/2 h-12 rounded-2xl bg-sky-500 text-white font-black cursor-pointer"
          >
            모집글 등록
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
