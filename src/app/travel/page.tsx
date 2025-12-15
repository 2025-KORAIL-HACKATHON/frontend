"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import MobileFrame from "@/components/mobile/MobileFrame";
import MateRequirementModal from "@/components/travel/MateRequirementModal";

// mock 상태(나중에 API/스토어로 교체)
const PURCHASE_KEY = "korail.purchaseHistory.v1";
const CERT_KEY = "korail.certified.v1";

function getBool(key: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

function Avatar({ seed }: { seed: string }) {
  const initials = seed?.slice(0, 1).toUpperCase() || "K";
  return (
    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-700">
      {initials}
    </div>
  );
}

export default function TravelPage() {
  const router = useRouter();
  const { profile, ready } = useTravelProfile();

  const [openReq, setOpenReq] = useState(false);
  const [purchaseOk, setPurchaseOk] = useState(false);
  const [certifiedOk, setCertifiedOk] = useState(false);

  if (!ready) return null;

  const profileOk = !!profile;
  const hasProfile = profileOk;

  const openModal = () => {
    // 모달 열 때 최신 상태 다시 읽기 (다른 페이지에서 설정하고 돌아올 수 있으니까)
    setPurchaseOk(getBool(PURCHASE_KEY));
    setCertifiedOk(getBool(CERT_KEY));
    setOpenReq(true);
  };

  return (
    <MobileFrame>
      <MateRequirementModal
        open={openReq}
        onClose={() => setOpenReq(false)}
        purchaseOk={purchaseOk}
        certifiedOk={certifiedOk}
        profileOk={profileOk}
        onGoPurchase={() => router.push("/ticket")}
        onGoVerify={() => router.push("/auth/verify")}
        onGoProfile={() => router.push("/travel/profile")}
        onConfirm={() => router.push("/travel/recommend/input")}
      />

      <div className="bg-white">
        <section className="relative h-56">
          <Image
            src="/images/travel-hero.jpg"
            alt="travel hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute left-5 top-14 text-white">
            <div className="text-3xl font-black leading-tight">
              Explore the
              <br />
              korail today
            </div>
            <div className="mt-2 text-sm opacity-90">
              코레일과 함께 여행을 즐겨보세요!
            </div>
          </div>

          <div className="absolute right-4 top-14 flex flex-col items-center gap-2">
            <div>{hasProfile && <Avatar seed={profile!.avatarSeed} />}</div>
            <button
              type="button"
              onClick={() => router.push("/travel/profile")}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              {hasProfile ? "여행 프로필 수정" : "여행 프로필 만들기"}
            </button>
          </div>
        </section>

        <section className="px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">
                혼자 여행은 좋지만, 혼밥은 싫다면 ?
              </div>
              <div className="text-lg font-black">여행 메이트 구하기</div>
            </div>

            {/* 여기만 변경: 모달 오픈 */}
            <button
              type="button"
              onClick={openModal}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              여행 메이트 구하기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl bg-neutral-200" />
            <div className="h-40 rounded-2xl bg-neutral-200 border-2 border-purple-500" />
          </div>
        </section>

        <section className="px-5 pb-24">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black">
              당신에게 딱 맞는
              <br />
              국내 여행지 코스를 추천받아 보세요
            </div>
            <button
              onClick={openModal}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              맞춤 일정 추천받기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl bg-neutral-200 flex items-end p-3 font-bold">
              Seoul
            </div>
            <div className="h-40 rounded-2xl bg-neutral-200 flex items-end p-3 font-bold">
              Daejeon
            </div>
          </div>
        </section>
      </div>
    </MobileFrame>
  );
}
