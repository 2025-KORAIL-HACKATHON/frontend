"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { mockPosts, TripPost } from "@/lib/koTripMock";
import {
  getBool,
  KO_MATE_INPUT_KEY,
  KO_TRIP_CREATED_KEY,
} from "@/lib/koTripStorage";
import Modal from "@/components/common/Modal";

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
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-hidden
      />
      <Modal open={open} onClose={onClose}>
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
      </Modal>
    </div>
  );
}

function PostCard({ p, onClick }: { p: TripPost; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer w-full text-left py-5 border-b border-gray-300"
    >
      <div className="flex gap-4">
        <div className="h-28 w-28 rounded-2xl bg-neutral-200 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="font-black text-base leading-tight">{p.title}</div>
          <div className="mt-1 text-sm text-neutral-700 line-clamp-2">
            {p.desc}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-1">
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

          <div className="mt-2 inline-flex items-center gap-2 rounded-md shadow px-3 py-1 text-xs text-neutral-700">
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
    </button>
  );
}

export default function KoTripPage() {
  const router = useRouter();

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
    router.push("/travel/ko-trip/info"); // (2번째 이미지) 정보 입력 페이지
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <NeedInfoModal
        open={needModalOpen}
        onClose={() => setNeedModalOpen(false)}
        onGoInput={goInput}
      />

      <div className="h-full bg-white flex flex-col">
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

            <div className="flex-1">
              <div className="h-11 rounded-2xl border border-sky-400 bg-white" />
            </div>

            {/* 채팅 목록으로 이동 */}
            <button
              type="button"
              className="cursor-pointer p-2"
              aria-label="채팅"
              onClick={() => router.push("/travel/chat")}
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

        {/* PostCard 클릭 → 상세 페이지 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5">
          {mockPosts.map((p) => (
            <PostCard
              key={p.id}
              p={p}
              onClick={() => router.push(`/travel/ko-trip/${p.id}`)}
            />
          ))}
        </div>

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
