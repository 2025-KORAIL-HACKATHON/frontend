"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

const KO_TRIP_STEP1_KEY = "korail.koTripStep1.v1";
const KO_TRIP_STEP2_KEY = "korail.koTripStep2.v1";
const KO_TRIP_CREATED_KEY = "korail.koTripCreatedOnce.v1";

function readJSON<T>(key: string): T | null {
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

export default function KoTripGeneratePage() {
  const router = useRouter();

  const step1 = useMemo(() => readJSON<any>(KO_TRIP_STEP1_KEY), []);
  const step2 = useMemo(() => readJSON<any>(KO_TRIP_STEP2_KEY), []);

  const [authorComment, setAuthorComment] = useState("");

  const chips = useMemo(() => {
    if (!step1) return [];
    const daysText = step1.startDate && step1.endDate ? "총 1박 2일" : "";
    return [
      {
        icon: "/icons/calendar.svg",
        label: `${step1.startDate} ~ ${step1.endDate} (${daysText})`,
      },
      { icon: "/icons/user.svg", label: `${step1.people ?? ""}` },
      { icon: "/icons/bolt.svg", label: `${step1.intensity ?? ""}` },
      { icon: "/icons/money.svg", label: `인당 30만원대` },
      { icon: "/icons/pin.svg", label: `${step1.purpose ?? ""}` },
    ].filter((x) => x.label.trim().length > 0);
  }, [step1]);

  const onRegister = () => {
    // “모집글 작성 경험” 처리
    localStorage.setItem(KO_TRIP_CREATED_KEY, "true");
    router.replace("/travel/ko-trip/info/done");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        {/* 헤더 */}
        <header className="shrink-0 px-4 pt-3 pb-3  bg-white">
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
          {/* 지도/이미지 박스 */}
          <div className="relative h-44 w-full overflow-hidden rounded-3xl bg-neutral-200">
            <Image
              src="/images/map-sample.jpg"
              alt="map"
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-5 text-2xl font-black">동행 구인 글 제목</div>
          <div className="mt-1 text-sm text-neutral-700">
            여행 취향 선택을 취합해 AI가 써준 해당 동행 구인 글에 대한 간단한
            소개 내용 표시
          </div>

          {/* 칩 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-neutral-800"
              >
                <Image src={c.icon} alt="" width={14} height={14} />
                {c.label}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-sm font-black">동행자 관련 정보</div>
            <div className="mt-2 rounded-2xl border p-4 text-sm text-neutral-600 min-h-20">
              {step2
                ? `성별: ${step2.gender} / 연령대: ${step2.age} / MBTI: ${step2.mbti} / 기상: ${step2.wake} / 음식: ${step2.food}`
                : "모달 입력받은거 취합해서 AI 글쓰기 결과로"}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-black">작성자 관련 정보</div>
            <div className="mt-2 rounded-2xl border p-4 text-sm text-neutral-600 min-h-20">
              {step1
                ? `출발지: ${step1.origin} / 여행지역: ${step1.region} / 여행유형: ${step1.travelType}`
                : "모달 입력받은거 취합해서 AI 글쓰기 결과로"}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-black">작성자 코멘트</div>
            <textarea
              value={authorComment}
              onChange={(e) => setAuthorComment(e.target.value)}
              className="mt-2 w-full rounded-2xl border p-4 text-sm min-h-24"
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
