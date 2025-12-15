export type TravelType = "FREE" | "PACKAGE";

export type RecommendInput = {
  travelType: TravelType; // 자유/패키지
  region1: string; // 예: 서울/부산
  region2: string; // 예: 강남/해운대 (선택)
  period: "당일" | "1박2일" | "2박3일" | "3박4일" | "4박이상";
  purposes: string[]; // 다중
  intensity: "여유" | "중간" | "강행군";
  people: "혼자서" | "단둘이" | "3명 이상";
};

export type ItineraryItem = {
  time: string;
  title: string;
  desc: string;
};

export type ItineraryDay = {
  day: number;
  items: ItineraryItem[];
};

export type PackageItem = {
  id: string;
  title: string;
  region: string; // 서울/부산/대전...
  period: string; // 당일/1박2일/2박3일...
  purposes: string[]; // 목적 키워드
  price: number;
  provider: string;
};

export type RecommendState = {
  input: RecommendInput | null;
  setInput: (v: RecommendInput) => void;

  // 결과 저장
  itinerary: ItineraryDay[]; // 자유여행 결과
  matchedPackages: PackageItem[]; // 패키지 결과

  setItinerary: (days: ItineraryDay[]) => void;
  setMatchedPackages: (items: PackageItem[]) => void;

  reset: () => void;
};
