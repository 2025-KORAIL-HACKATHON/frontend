"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

const CERT_KEY = "korail.certified.v1";

export default function VerifyPage() {
  const router = useRouter();
  const [certified, setCertified] = useState(false);

  useEffect(() => {
    setCertified(localStorage.getItem(CERT_KEY) === "true");
  }, []);

  const markDone = () => {
    localStorage.setItem(CERT_KEY, "true");
    setCertified(true);
  };

  const reset = () => {
    localStorage.setItem(CERT_KEY, "false");
    setCertified(false);
  };

  return (
    <MobileFrame showTopBar={false}>
      <div className="h-full flex flex-col bg-white">
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b">
          <button
            onClick={() => router.back()}
            className="text-sm cursor-pointer"
          >
            ←
          </button>
          <div className="font-bold">본인인증</div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="rounded-2xl border p-4">
            <div className="font-bold text-lg">현재 상태</div>
            <div className="mt-2 text-sm text-neutral-600">
              본인인증:{" "}
              <span
                className={certified ? "text-emerald-600" : "text-rose-500"}
              >
                {certified ? "완료" : "미완료"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={markDone}
              className="h-12 rounded-xl bg-emerald-600 text-white font-bold"
            >
              (mock) 본인인증 완료 처리
            </button>
            <button
              onClick={reset}
              className="h-12 rounded-xl bg-neutral-200 text-neutral-700 font-bold"
            >
              초기화
            </button>
          </div>

          <button
            onClick={() => router.push("/travel")}
            className="mt-6 w-full h-12 rounded-xl bg-black text-white font-bold"
          >
            여행상품·패스로 돌아가기
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
