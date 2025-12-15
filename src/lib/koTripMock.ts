export type TripPost = {
  id: string;
  title: string;
  desc: string;
  nickname: string;
  ageGroup: string;
  gender: string;
  start: string;
  end: string;
  daysText: string;
  purposeImages: string[];
};

export type ChatRoom = {
  id: string;
  name: string; // 트랙션 팀원 / 닉네임 등
  lastText: string;
  lastAgo: string; // "1 day ago"
};

export const PURPOSE_IMAGE_LIST = [
  "/images/leisure.png",
  "/images/culture.png",
  "/images/nature.png",
  "/images/cozy.png",
  "/images/meal.png",
  "/images/shopping.png",
  "/images/travel.png",
  "/images/visit.png",
  "/images/sns.png",
] as const;

// -----------------------------
// 랜덤 더미 데이터 소스
// -----------------------------
const TITLES = [
  "맛집 같이 가실 분 구해요",
  "혼자 가기 아쉬운 여행",
  "힐링 여행 메이트 구합니다",
  "사진 찍으러 같이 가요",
  "자유롭게 여행하실 분",
  "현지 투어 함께하실 분",
  "핫플 위주로 같이 돌아요",
  "가볍게 1박2일 다녀요",
];

const DESCS = [
  "혼자 가기 어려운 체험이나 맛집 같이 가실 분 구합니다! 제가 현지 맛집 정보를 많이 알고 있어요.",
  "일정은 유동적으로 조정 가능하고, 편하게 같이 다녀요!",
  "여유롭게 구경하고 카페도 들르는 스타일이에요. 부담 없이 연락 주세요.",
  "사진 찍는 거 좋아하시는 분 환영합니다. 인생샷 코스 짜볼게요.",
  "맛집 위주로 다니고, 이동은 최소로 하고 싶어요. 느긋하게 즐겨요.",
  "유명 관광지 + 로컬 코스 섞어서 가려구요. 같이 계획해요!",
];

const NICKNAMES = [
  "트랙션 팀원",
  "여행러버",
  "코레일덕후",
  "혼행러",
  "맛집헌터",
  "사진장인",
  "힐링매니아",
  "핫플수집가",
];

const AGE_GROUPS = ["20대", "30대", "40대", "50대"] as const;
const GENDERS = ["여자", "남자"] as const;

const DATE_SETS = [
  { start: "25.12.14", end: "25.12.15", daysText: "(2일)" },
  { start: "25.12.20", end: "25.12.22", daysText: "(3일)" },
  { start: "26.01.03", end: "26.01.03", daysText: "(당일)" },
  { start: "26.01.10", end: "26.01.13", daysText: "(4일)" },
  { start: "26.02.01", end: "26.02.02", daysText: "(2일)" },
] as const;

// -----------------------------
// 유틸
// -----------------------------
const rand = <T>(arr: readonly T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const shuffle = <T>(arr: readonly T[]) =>
  [...arr].sort(() => Math.random() - 0.5);

// 9장 중에서 몇 장만 쓰고 싶으면 이 함수 사용 (기본: 9장 전부)
const pickSome = <T>(arr: readonly T[], count: number) =>
  shuffle(arr).slice(0, Math.max(0, Math.min(count, arr.length)));

// -----------------------------
// mockPosts (전부 랜덤 생성)
// -----------------------------
export const mockPosts: TripPost[] = Array.from({ length: 6 }).map((_, i) => {
  const date = rand(DATE_SETS);

  return {
    id: String(i + 1),
    title: rand(TITLES),
    desc: rand(DESCS),
    nickname: i === 0 ? "트랙션 팀원" : rand(NICKNAMES),
    ageGroup: rand(AGE_GROUPS),
    gender: rand(GENDERS),
    start: date.start,
    end: date.end,
    daysText: date.daysText,

    // (1) 9장 전부 랜덤 순서로 넣기
    purposeImages: shuffle(PURPOSE_IMAGE_LIST),

    // (2) 만약 “대표 이미지만 1~3장”만 쓰고 싶으면 위 대신 아래로 바꿔
    // purposeImages: pickSome(PURPOSE_IMAGE_LIST, rand([1, 2, 3] as const)),
  };
});

// -----------------------------
// mockRooms (그대로 두거나 랜덤화 가능)
// -----------------------------
export const mockRooms: ChatRoom[] = [
  {
    id: "room-traction",
    name: "트랙션 팀원",
    lastText: "채팅 내용 입니다. 채팅 내용 입니다. 채팅 내용 입니다…",
    lastAgo: "1 day ago",
  },
  {
    id: "room-1",
    name: "닉네임",
    lastText: "채팅 내용 입니다. 채팅 내용 입니다. 채팅 내용 입니다…",
    lastAgo: "1 day ago",
  },
  {
    id: "room-2",
    name: "닉네임",
    lastText: "채팅 내용 입니다. 채팅 내용 입니다. 채팅 내용 입니다…",
    lastAgo: "1 day ago",
  },
  {
    id: "room-3",
    name: "닉네임",
    lastText: "채팅 내용 입니다. 채팅 내용 입니다. 채팅 내용 입니다…",
    lastAgo: "1 day ago",
  },
];
