import { create } from 'zustand'
import { ExtraData } from '@/types'

interface GlobalState {
    isConnectPS: boolean;
    extraData?: ExtraData;
    setExtraData: (newExtraData: ExtraData | undefined) => void;
    setIsConnectPS: (newIsConnectPS: boolean) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
    isConnectPS: false,
    extraData: undefined,
    setExtraData: (newExtraData: ExtraData | undefined) => set({ extraData: newExtraData }),
    setIsConnectPS: (newIsConnectPS: boolean) => set({ isConnectPS: newIsConnectPS }),
}));

export default useGlobalStore;