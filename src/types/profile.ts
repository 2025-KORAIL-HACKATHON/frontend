export interface TravelProfile {
  name: string;
  nickname: string;
  gender: "M" | "F" | "";
  birth: string; // YYYY-MM-DD
  region: string;
  intro: string;
  mbti: string;
  wakeUp: "morning" | "night" | "flex" | "";
  food: string[]; // ["한식","양식"...]
  etc: string[]; // ["금연","금주"...]
  avatarSeed: string; // 기본 프로필 이미지 생성용 seed
}
