"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import StepProgress from "@/components/travel/StepProgress";

const KO_MATE_INPUT_KEY = "korail.koMateInfoDone.v1";
const KO_TRIP_CREATED_KEY = "korail.koTripCreatedOnce.v1";
const KO_TRIP_INFO_MODE_KEY = "korail.koTripInfoMode.v1";

type OptionKey = "manual" | "ticket" | "history";

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

function RadioCard({
  active,
  title,
  onClick,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "cursor-pointer w-full h-16 rounded-2xl border px-5 flex items-center justify-between",
        active ? "border-black" : "border-neutral-200",
      ].join(" ")}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div
        className={[
          "h-5 w-5 rounded-full border flex items-center justify-center",
          active ? "border-black" : "border-neutral-400",
        ].join(" ")}
      >
        {active ? <div className="h-2.5 w-2.5 rounded-full bg-black" /> : null}
      </div>
    </button>
  );
}

export default function KoTripInfoPage() {
  const router = useRouter();
  const [picked, setPicked] = useState<OptionKey>("manual");

  const steps = useMemo(() => [1, 2, 3], []);

  const onNext = () => {
    localStorage.setItem(KO_TRIP_INFO_MODE_KEY, picked);
    localStorage.setItem(KO_MATE_INPUT_KEY, "true");

    if (picked === "history") {
      localStorage.setItem(KO_TRIP_CREATED_KEY, "true");
    }

    router.push("/travel/ko-trip/info/step1");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        {/* 헤더 */}
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-4 bg-white">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer justify-self-start p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <IconBack />
          </button>

          <div className="justify-self-center font-bold">정보 입력</div>
          <div className="justify-self-end w-6" />
        </header>

        <div className="flex-1 min-h-0 px-6 pt-6">
          {/* 가운데 SVG */}
          <div className="absolute left-1/2 top-12 -translate-x-1/2">
            <Image
              src="/icons/komate.svg"
              alt="ko mate"
              width={120}
              height={24}
              priority
            />
          </div>

          {/* 컴포넌트 적용 (현재 1단계) */}
          <StepProgress total={3} current={1} />

          <div className="mt-4 text-sm font-bold">불러오기</div>

          <div className="mt-5 space-y-3">
            <RadioCard
              active={picked === "manual"}
              title="처음부터 직접 입력하기"
              onClick={() => setPicked("manual")}
            />
            <RadioCard
              active={picked === "ticket"}
              title="승차권 예약 정보 불러오기"
              onClick={() => setPicked("ticket")}
            />
            <RadioCard
              active={picked === "history"}
              title="ko trip 이용 기록 불러오기"
              onClick={() => setPicked("history")}
            />
          </div>
        </div>

        <div className="shrink-0 px-6 pb-6">
          <button
            type="button"
            onClick={onNext}
            className="w-full h-14 rounded-2xl bg-sky-500 text-white font-black cursor-pointer"
          >
            다 음
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
