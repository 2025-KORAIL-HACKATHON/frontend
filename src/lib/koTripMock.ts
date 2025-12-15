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
};

export type ChatRoom = {
  id: string;
  name: string; // 트랙션 팀원 / 닉네임 등
  lastText: string;
  lastAgo: string; // "1 day ago"
};

export const mockPosts: TripPost[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  title: "제목",
  desc: "혼자 가기 어려운 체험이나 맛집 같이 가실 분 구합니다! 제가 현지 맛집 정보를 많이 알고 있어…",
  nickname: i === 0 ? "트랙션 팀원" : "닉네임",
  ageGroup: "30대",
  gender: "여자",
  start: "25.12.14",
  end: "25.12.15",
  daysText: "(2일)",
}));

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
