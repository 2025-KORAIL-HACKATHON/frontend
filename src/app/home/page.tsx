import MobileFrame from "@/components/mobile/MobileFrame";
import TopAppBar from "@/components/mobile/TopAppBar";
import BottomTabBar from "@/components/mobile/BottomTabBar";

export default function HomePage() {
  return (
    <MobileFrame>
      <div className="min-h-dvh flex flex-col">
        <TopAppBar />
        <main className="flex-1 bg-neutral-50 p-4">홈(placeholder)</main>
        <BottomTabBar />
      </div>
    </MobileFrame>
  );
}
