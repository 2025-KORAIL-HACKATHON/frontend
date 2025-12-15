"use client";

import { useEffect, useState } from "react";
import {
  loadTravelProfile,
  saveTravelProfile,
} from "@/lib/travelProfileStorage";
import type { TravelProfile } from "@/types/profile";

type UseTravelProfileReturn = {
  profile: TravelProfile | null;
  ready: boolean;
  upsert: (next: TravelProfile) => void;
};

export function useTravelProfile(): UseTravelProfileReturn {
  const [profile, setProfile] = useState<TravelProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadTravelProfile());
    setReady(true);
  }, []);

  const upsert = (next: TravelProfile) => {
    saveTravelProfile(next);
    setProfile(next);
  };

  return { profile, ready, upsert };
}
