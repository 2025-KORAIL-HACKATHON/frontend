"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

type TripPost = {
  id: string;
  title: string;
  desc: string;
  nickname: string;
  ageGroup: string;
  gender: string;
  start: string;
  end: string;
  daysText: string;
};

// 조건 키 (원하는 이름으로 바꿔도 됨)
const KO_MATE_INPUT_KEY = "korail.koMateInfoDone.v1"; // 여행 정보 입력 완료 여부
const KO_TRIP_CREATED_KEY = "korail.koTripCreatedOnce.v1"; // 모집글 생성 경험 여부

function getBool(key: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
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

function PostCard({ p }: { p: TripPost }) {
  return (
    <div className="py-5 border-b border-gray-300">
      <div className="flex gap-4">
        <div className="h-28 w-28 rounded-2xl bg-neutral-200 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="font-black text-base leading-tight">{p.title}</div>
          <div className="mt-1 text-sm text-neutral-700 line-clamp-2">
            {p.desc}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-1">
              {/* ✅ IconUser -> svg 파일 */}
              <Image
                src="/icons/user.svg"
                alt=""
                width={16}
                height={16}
                className="block"
              />
              {p.nickname} | {p.ageGroup} | {p.gender}
            </span>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs text-neutral-700">
            {/* ✅ IconCalendar -> svg 파일 */}
            <Image
              src="/icons/calendar.svg"
              alt=""
              width={16}
              height={16}
              className="block"
            />
            {p.start} ~ {p.end} {p.daysText}
          </div>
        </div>
      </div>
    </div>
  );
}

function NeedInfoModal({
  open,
  onClose,
  onGoInput,
}: {
  open: boolean;
  onClose: () => void;
  onGoInput: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999">
      {/* dim */}
      <div
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-hidden
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/warn.svg"
              alt="경고"
              width={18}
              height={18}
              className="shrink-0"
              priority
            />
            <div className="text-sm font-semibold text-neutral-800">
              아직 여행 정보를 생성하지 않았습니다.
            </div>
          </div>

          <button
            type="button"
            onClick={onGoInput}
            className="cursor-pointer mt-4 w-full h-10 rounded-full bg-black text-white text-sm font-bold"
          >
            입력 바로가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KoTripPage() {
  const router = useRouter();

  const posts = useMemo<TripPost[]>(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: String(i + 1),
        title: "제목",
        desc: "혼자 가기 어려운 체험이나 맛집 같이 가실 분 구합니다! 제가 현지 맛집 정보를 많이 알고 있어…",
        nickname: "닉네임",
        ageGroup: "30대",
        gender: "여자",
        start: "25.12.14",
        end: "25.12.15",
        daysText: "(2일)",
      })),
    []
  );

  const [hasInfo, setHasInfo] = useState(false);
  const [hasCreatedOnce, setHasCreatedOnce] = useState(false);
  const [needModalOpen, setNeedModalOpen] = useState(false);

  useEffect(() => {
    setHasInfo(getBool(KO_MATE_INPUT_KEY));
    setHasCreatedOnce(getBool(KO_TRIP_CREATED_KEY));
  }, []);

  const guardOrRun = (action: () => void) => {
    if (!hasInfo || !hasCreatedOnce) {
      setNeedModalOpen(true);
      return;
    }
    action();
  };

  const goInput = () => {
    setNeedModalOpen(false);
    router.push("/travel/ko-trip/info");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <NeedInfoModal
        open={needModalOpen}
        onClose={() => setNeedModalOpen(false)}
        onGoInput={goInput}
      />

      <div className="h-full bg-white flex flex-col">
        {/* 상단 */}
        <header className="shrink-0 px-4 pt-3 pb-2 bg-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <IconBack />
            </button>

            {/* 검색바 */}
            <div className="flex-1">
              <div className="h-11 rounded-2xl border border-sky-400 bg-white" />
            </div>

            {/* 채팅 아이콘(svg 파일) */}
            <button
              type="button"
              className="cursor-pointer p-2"
              aria-label="채팅"
            >
              <Image
                src="/icons/chat.svg"
                alt="채팅"
                width={22}
                height={22}
                className="block"
                priority
              />
            </button>
          </div>

          {/* 필터 버튼 */}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() =>
                guardOrRun(() => router.push("/travel/ko-trip/filter"))
              }
              className="cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-full bg-sky-500 text-white text-xs font-bold shadow"
            >
              맞춤형 모집글 확인하기
              <Image
                src="/icons/sliders.svg"
                alt=""
                width={18}
                height={18}
                className="block"
              />
            </button>
          </div>
        </header>

        {/* 리스트(스크롤) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5">
          {posts.map((p) => (
            <PostCard key={p.id} p={p} />
          ))}
        </div>

        {/* 하단 고정 CTA */}
        <div className="shrink-0 px-5 p-5">
          <button
            type="button"
            onClick={() =>
              guardOrRun(() => router.push("/travel/ko-trip/create"))
            }
            className="cursor-pointer w-full h-14 rounded-2xl bg-sky-500 text-white font-black shadow"
          >
            + AI 자동 모집글 생성하기
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
