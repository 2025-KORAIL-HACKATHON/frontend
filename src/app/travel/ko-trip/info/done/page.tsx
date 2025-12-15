"use client";

import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

export default function KoTripDonePage() {
  const router = useRouter();

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        <div className="flex-1 flex items-start justify-center pt-24 px-6">
          <div className="text-center text-base font-semibold">
            모집글 등록이 완료되었습니다.
          </div>
        </div>

        <div className="shrink-0 px-6 pb-8">
          <button
            type="button"
            onClick={() => router.replace("/travel/ko-trip")}
            className="w-full h-14 rounded-2xl bg-sky-500 text-white font-black cursor-pointer"
          >
            모집글 목록 보기
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
