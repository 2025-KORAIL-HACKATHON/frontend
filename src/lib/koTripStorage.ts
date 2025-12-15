export const KO_MATE_INPUT_KEY = "korail.koMateInfoDone.v1";
export const KO_TRIP_CREATED_KEY = "korail.koTripCreatedOnce.v1";

export function getBool(key: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

export function setBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value ? "true" : "false");
}

export type ChatMessage = {
  id: string;
  roomId: string;
  from: "me" | "other";
  text: string;
  ts: number; // ms
};

const CHAT_KEY = (roomId: string) => `korail.chat.${roomId}.v1`;

export function loadChat(roomId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHAT_KEY(roomId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChat(roomId: string, msgs: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_KEY(roomId), JSON.stringify(msgs));
}
