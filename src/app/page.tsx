"use client";

import Image from "next/image";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/home"); // 뒤로가기 했을 때 스플래시로 안 돌아오게
    }, 1200);

    return () => clearTimeout(t);
  }, [router]);
  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <main className="relative min-h-dvh">
        <Image
          src="/images/splash.png"
          alt="코레일톡 스플래시"
          fill
          priority
          className="object-cover"
        />
      </main>
    </MobileFrame>
  );
}
