import { ChangelogItemType } from '@/types';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface LocaleState {
    locale: string;
    theme: string;
    currentVersion: string
    changelog: ChangelogItemType[]
    setCurrentVersion: (currentVersion: string) => void;
    setChangelog: (newChangelog: ChangelogItemType[]) => void;
    setTheme: (newTheme: string) => void;
    setLocale: (newLocale: string) => void;
}

const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: "en",
            theme: "night",
            currentVersion: "",
            changelog: [],
            setCurrentVersion: (currentVersion: string) => set({ currentVersion }),
            setChangelog: (newChangelog: ChangelogItemType[]) => set({ changelog: newChangelog }),
            setTheme: (newTheme: string) => set({ theme: newTheme }),
            setLocale: (newLocale: string) => set({ locale: newLocale }),
        }),
        {
            name: 'locale-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useLocaleStore;