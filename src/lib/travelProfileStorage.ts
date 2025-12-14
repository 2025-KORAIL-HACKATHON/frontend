import { TravelProfile } from "@/types/profile";

const KEY = "korail.travelProfile.v1";

export function loadTravelProfile(): TravelProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TravelProfile;
  } catch {
    return null;
  }
}

export function saveTravelProfile(p: TravelProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearTravelProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
