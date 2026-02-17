import { MonsterBasic } from '@/types'
import { create } from 'zustand'

interface MonsterState {
  listMonster: MonsterBasic[]
  mapMonster: Record<string, MonsterBasic>
  setListMonster: (newListMonster: MonsterBasic[]) => void
  setAllMapMonster: (newMonster: Record<string, MonsterBasic>) => void
  setMapMonster: (monsterId: string, newMonster: MonsterBasic) => void
}

const useMonsterStore = create<MonsterState>((set) => ({
  listMonster: [],
  mapMonster: {},

  setListMonster: (newListMonster) =>
    set({ listMonster: newListMonster }),

  setMapMonster: (monsterId, newMonster) =>
    set((state) => ({
      mapMonster: { ...state.mapMonster, [monsterId]: newMonster },
    })),

  setAllMapMonster: (newMonster) =>
    set({ mapMonster: newMonster }),
}))

export default useMonsterStore
