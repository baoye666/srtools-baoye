import { MonsterBasic, MonsterDetail, MonsterValue } from '@/types'
import { create } from 'zustand'

interface MonsterState {
  listMonster: MonsterBasic[]
  mapMonster: Record<string, MonsterBasic>
  mapMonsterInfo: Record<string, MonsterDetail>
  mapMonsterValue: Record<string, MonsterValue>
  setListMonster: (newListMonster: MonsterBasic[]) => void
  setMapMonsterInfo: (monsterId: string, newMonster: MonsterDetail) => void
  setAllMapMonsterInfo: (newMonster: Record<string, MonsterDetail>) => void
  setMapMonsterValue: (monsterId: string, newMonster: MonsterValue) => void
  setAllMapMonsterValue: (newMonster: Record<string, MonsterValue>) => void
  setMapMonster: (monsterId: string, newMonster: MonsterBasic) => void
  setAllMapMonster: (newMonster: Record<string, MonsterBasic>) => void
}

const useMonsterStore = create<MonsterState>((set) => ({
  listMonster: [],
  mapMonster: {},
  mapMonsterInfo: {},
  mapMonsterValue: {},

  setListMonster: (newListMonster) =>
    set({ listMonster: newListMonster }),

  setMapMonster: (monsterId, newMonster) =>
    set((state) => ({
      mapMonster: { ...state.mapMonster, [monsterId]: newMonster },
    })),

  setAllMapMonster: (newMonster) =>
    set({ mapMonster: newMonster }),

  setMapMonsterInfo: (monsterId, newMonster) =>
    set((state) => ({
      mapMonsterInfo: { ...state.mapMonsterInfo, [monsterId]: newMonster },
    })),

  setAllMapMonsterInfo: (newMonster) =>
    set({ mapMonsterInfo: newMonster }),

  setMapMonsterValue: (monsterId, newMonster) =>
    set((state) => ({
      mapMonsterValue: { ...state.mapMonsterValue, [monsterId]: newMonster },
    })),

  setAllMapMonsterValue: (newMonster) =>
    set({ mapMonsterValue: newMonster }),
}))

export default useMonsterStore
