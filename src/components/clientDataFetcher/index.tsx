"use client";

import {
  useFetchASData,
  useFetchAvatarData,
  useFetchChangelog,
  useFetchConfigData,
  useFetchLightconeData,
  useFetchMOCData,
  useFetchMonsterData,
  useFetchPEAKData,
  useFetchPFData,
  useFetchRelicData
} from "@/lib/hooks";

export default function ClientDataFetcher() {
  useFetchConfigData();
  useFetchAvatarData();
  useFetchLightconeData();
  useFetchRelicData();
  useFetchMonsterData();
  useFetchPFData();
  useFetchMOCData();
  useFetchASData();
  useFetchPEAKData();
  useFetchChangelog();

  return null;
}
