import Image from "next/image";
import MobileFrame from "@/components/mobile/MobileFrame";

export default function HomePage() {
  return (
    <MobileFrame>
      <main className="relative h-full w-full overflow-hidden">
        <Image
          src="/images/home.png"
          alt="홈"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
        />
      </main>
    </MobileFrame>
  );
}
