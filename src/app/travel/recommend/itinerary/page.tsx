"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRecommendStore } from "@/stores/recommendStore";
import { useInView } from "@/hooks/useInView";

type Ticket = {
  trainNo: string;
  departTime: string;
  arriveTime: string;
  from: string;
  to: string;
  price: number;
  badgeText?: string;
  statusText?: string;
};

type TimelineItem =
  | { kind: "TICKET"; title: string; ticket: Ticket }
  | { kind: "NORMAL"; title: string; desc: string; badge?: string };

type DayPlan = {
  day: number;
  heroTitle: string;
  items: TimelineItem[];
};

function DayChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 px-5 rounded-full border text-sm",
        active ? "border-black font-bold text-black" : "text-neutral-500",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function TimelineNumber({ n }: { n: number }) {
  // 1부터 보이도록
  return (
    <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
      {n}
    </div>
  );
}

/** 들어올 때마다 다시 재생되는 Shine */
function ShineOverlay({ playId }: { playId: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
    >
      <div
        key={playId} //  key 변화로 애니메이션 재시작
        className={[
          "absolute -inset-y-6 -left-1/2 w-[200%]",
          "bg-linear-to-r from-transparent via-sky-200/40 to-transparent",
          "rotate-12",
          "animate-[shine_1.2s_ease-out]",
        ].join(" ")}
      />
    </div>
  );
}

/**
 *  카드 공통:
 * - viewport 진입할 때마다 shine playId++
 * - fade-up(등장)은 최초 1회만 (스크롤 업/다운 때 다시 숨지 않게)
 */
function useCardMotion() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -20% 0px",
    threshold: 0.15,
  });

  const [playId, setPlayId] = useState(0);
  const [shownOnce, setShownOnce] = useState(false);
  const prev = useRef(false);

  useEffect(() => {
    // false -> true 로 바뀌는 "진입" 순간마다 shine 재생
    if (!prev.current && inView) {
      setPlayId((v) => v + 1);
      setShownOnce(true);
    }
    prev.current = inView;
  }, [inView]);

  return { ref, playId, shownOnce };
}

function TicketCard({
  title,
  ticket,
  onGoReserve,
}: {
  title: string;
  ticket: Ticket;
  onGoReserve: () => void;
}) {
  const { ref, playId, shownOnce } = useCardMotion();

  return (
    <div
      ref={ref}
      className={[
        "relative rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-neutral-100 p-4 overflow-hidden",
        "transition-all duration-500",
        shownOnce ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      {playId > 0 && <ShineOverlay playId={playId} />}

      <div className="relative font-bold text-sky-600">{title}</div>

      <div className="relative mt-3 rounded-xl border border-neutral-200 p-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-neutral-800">
            {ticket.trainNo}
          </div>

          <div className="ml-auto flex items-center gap-4 text-xs text-neutral-700">
            <div className="text-right">
              <div className="font-semibold">{ticket.departTime}</div>
              <div className="text-neutral-500">{ticket.from}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{ticket.arriveTime}</div>
              <div className="text-neutral-500">{ticket.to}</div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="text-xs font-bold text-sky-700">
            {formatWon(ticket.price)}
          </div>

          {ticket.badgeText ? (
            <span className="text-[10px] px-2 py-1 rounded-md border border-orange-200 bg-orange-50 text-orange-700 font-bold">
              {ticket.badgeText}
            </span>
          ) : null}

          {ticket.statusText ? (
            <span className="ml-auto text-[10px] px-2 py-1 rounded-md border border-rose-200 bg-rose-50 text-rose-600 font-bold">
              {ticket.statusText}
            </span>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onGoReserve}
        className="relative mt-4 w-full h-10 rounded-full bg-sky-500 text-white font-bold text-sm"
      >
        승차권 예매로 이동
      </button>
    </div>
  );
}

function NormalCard({
  title,
  desc,
  badge,
}: {
  title: string;
  desc: string;
  badge?: string;
}) {
  const { ref, playId, shownOnce } = useCardMotion();

  return (
    <div
      ref={ref}
      className={[
        "relative rounded-2xl bg-white shadow-[0_10px_24px_rgba(0,0,0,0.10)] border border-neutral-100 px-4 py-4 overflow-hidden",
        "transition-all duration-500",
        shownOnce ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      {playId > 0 && <ShineOverlay playId={playId} />}

      <div className="relative flex items-center gap-2">
        {badge ? (
          <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold">
            {badge}
          </span>
        ) : null}
        <div className="font-bold text-sky-600">{title}</div>
      </div>
      <div className="relative mt-2 text-sm text-neutral-600">{desc}</div>
    </div>
  );
}

export default function ItineraryPage() {
  const router = useRouter();
  const { input } = useRecommendStore();
  const [activeDay, setActiveDay] = useState(1);

  if (!input) {
    router.replace("/travel/recommend/input");
    return null;
  }
  if (input.travelType !== "FREE") {
    router.replace("/travel/recommend/packages");
    return null;
  }

  const city = input.region1 || "강릉";

  //  더미 승차권(가는/오는)
  const goTicket: Ticket = {
    trainNo: "KTX-이음 809",
    departTime: "09:55",
    arriveTime: "11:58",
    from: "서울",
    to: city,
    price: 27600,
    badgeText: "M 5% 적립",
    statusText: "매진",
  };

  const backTicket: Ticket = {
    trainNo: "KTX-이음 820",
    departTime: "19:10",
    arriveTime: "21:15",
    from: city,
    to: "서울",
    price: 27600,
    badgeText: "M 5% 적립",
  };

  //  더미 일정(마지막날에 “오는 승차권” 추가)
  const days: DayPlan[] = useMemo(() => {
    const base: DayPlan[] = [
      {
        day: 1,
        heroTitle: city,
        items: [
          { kind: "TICKET", title: "가는 승차권 맞춤 추천", ticket: goTicket },
          {
            kind: "NORMAL",
            title: `${city} 시티 호텔`,
            desc: "체크인 / 짐 보관 / 휴식",
            badge: "★ 코레일 제휴 상품",
          },
          {
            kind: "NORMAL",
            title: `${city} 중앙 시장`,
            desc: `${city} 간식거리가 모여있는 전통시장`,
          },
          {
            kind: "NORMAL",
            title: "히슬라아트월드",
            desc: "바다 앞 갤러리 감상",
          },
          {
            kind: "NORMAL",
            title: "순두부 젤라또",
            desc: "로컬 디저트 맛보기",
          },
          {
            kind: "NORMAL",
            title: `${city} 맛집`,
            desc: "현지인 추천 맛집 방문",
          },
          {
            kind: "NORMAL",
            title: "안목 해변",
            desc: "커피거리 + 바다 뷰 감상",
          },
          { kind: "NORMAL", title: `${city} 시티 호텔`, desc: "휴식 / 취침" },
        ],
      },
      {
        day: 2,
        heroTitle: city,
        items: [
          { kind: "NORMAL", title: "브런치 카페", desc: "여유로운 아침 식사" },
          {
            kind: "NORMAL",
            title: "바다 산책 코스",
            desc: "해변 산책 + 사진 스팟",
          },
          {
            kind: "NORMAL",
            title: "기념품 쇼핑",
            desc: "로컬샵 / 시장에서 쇼핑",
          },
          //  마지막날 “오는 승차권”
          {
            kind: "TICKET",
            title: "오는 승차권 맞춤 추천",
            ticket: backTicket,
          },
        ],
      },
    ];

    return base;
  }, [city]);

  const current = days.find((d) => d.day === activeDay) ?? days[0];

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      {/* 전체는 잠그고 내부만 스크롤 */}
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/* 고정 헤더 */}
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-4 border-b bg-white">
          <button
            type="button"
            onClick={() => router.back()}
            className="justify-self-start text-sm cursor-pointer"
            aria-label="뒤로가기"
          >
            ←
          </button>

          <div className="justify-self-center font-bold">AI 추천 일정표</div>

          <div className="justify-self-end w-6" />
        </header>

        {/* 헤더 아래 */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* 상단(원형 이미지 + 문구 + DAY 탭) */}
          <div className="shrink-0 px-5 pt-6">
            <div className="flex flex-row items-center justify-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src="/images/cover.png"
                  alt="cover"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-center">
                <div className="text-xl font-black leading-snug">
                  {current.heroTitle} 추천 일정입니다.
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 items-center justify-center">
              {days.map((d) => (
                <DayChip
                  key={d.day}
                  active={activeDay === d.day}
                  onClick={() => setActiveDay(d.day)}
                >
                  DAY {d.day}
                </DayChip>
              ))}
            </div>
          </div>

          {/*  리스트만 내부 스크롤 + 스크롤바 숨김 */}
          <div
            className={[
              "flex-1 min-h-0 overflow-y-auto px-5 py-6",
              "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            ].join(" ")}
          >
            <div className="relative">
              {/* 왼쪽 세로 라인 */}
              <div className="absolute left-4.5 top-2 bottom-2 w-1 rounded-full bg-sky-500/80" />

              <div className="space-y-4">
                {current.items.map((it, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    <div className="shrink-0 relative z-10">
                      <TimelineNumber n={idx + 1} />
                    </div>

                    <div className="flex-1">
                      {it.kind === "TICKET" ? (
                        <TicketCard
                          title={it.title}
                          ticket={it.ticket}
                          onGoReserve={() => router.push("/ticket")}
                        />
                      ) : (
                        <NormalCard
                          title={it.title}
                          desc={it.desc}
                          badge={it.badge}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 버튼에 가리지 않도록 여백 */}
              <div className="h-24" />
            </div>
          </div>

          {/* 하단 버튼 고정 */}
          <div className="shrink-0 px-5 pb-5">
            <button
              type="button"
              onClick={() => router.push("/travel")}
              className="w-full h-12 rounded-2xl bg-black text-white font-bold"
            >
              여행상품·패스로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
