"use client";

import TopAppBar from "@/components/mobile/TopAppBar";
import BottomTabBar from "@/components/mobile/BottomTabBar";

export default function MobileFrame({
  children,
  showTopBar = true,
  showBottomBar = true,
}: {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomBar?: boolean;
}) {
  return (
    <div className="h-dvh w-full bg-neutral-100 flex justify-center overflow-hidden">
      <div className="w-full max-w-107.5 h-dvh bg-white shadow-sm flex flex-col overflow-hidden">
        {showTopBar && <TopAppBar />}

        {/* 여기만 스크롤 */}
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>

        {showBottomBar && <BottomTabBar />}
      </div>
    </div>
  );
}
