import { RelicDetail } from '@/types';
import { create } from 'zustand'

interface RelicState {
    mapRelicInfo: Record<string, RelicDetail>;
    setMapRelicInfo: (lightconeId: string, newRelic: RelicDetail) => void;
    setAllMapRelicInfo: (newRelic: Record<string, RelicDetail>) => void;
}

const useRelicStore = create<RelicState>((set, get) => ({
    mapRelicInfo: {},
    setMapRelicInfo: (lightconeId: string, newRelic: RelicDetail) => set((state) => ({ mapRelicInfo: { ...state.mapRelicInfo, [lightconeId]: newRelic } })),
    setAllMapRelicInfo: (newRelic: Record<string, RelicDetail>) => set({ mapRelicInfo: newRelic }),
}));

export default useRelicStore;