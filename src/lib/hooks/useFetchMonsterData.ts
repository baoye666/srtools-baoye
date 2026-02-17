"use client"
import { useQuery } from '@tanstack/react-query'
import { getMonsterListApi } from '@/lib/api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useMonsterStore from '@/stores/monsterStore'
import { MonsterBasic } from '@/types'

export const useFetchMonsterData = () => {
    const { setAllMapMonster, setListMonster } = useMonsterStore()
    const { data: dataMonster, error: errorMonster } = useQuery({
        queryKey: ['monsterData'],
        queryFn: getMonsterListApi,
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (dataMonster && !errorMonster) {
            setListMonster(dataMonster.sort((a, b) => Number(b.id) - Number(a.id)))
            const monsterMap = dataMonster.reduce<Record<string, MonsterBasic>>((acc, m) => {
                acc[m.id] = m
                return acc
            }, {})
            setAllMapMonster(monsterMap)
        } else if (errorMonster) {
            toast.error("Failed to load monster data")
        }
    }, [dataMonster, errorMonster, setAllMapMonster, setListMonster])
}
