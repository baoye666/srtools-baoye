"use client"
import { useQuery } from '@tanstack/react-query'
import { getMonsterValueApi, getMonsterListApi, fetchMonsterByIdsNative } from '@/lib/api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useMonsterStore from '@/stores/monsterStore'
import { listCurrentLanguageApi } from '@/constant/constant'
import useLocaleStore from '@/stores/localeStore'

export const useFetchMonsterData = () => {
    const { setAllMapMonster, setListMonster, setAllMapMonsterValue, setAllMapMonsterInfo } = useMonsterStore()
    const { locale } = useLocaleStore()
    const { data: dataMonster, error: errorMonster } = useQuery({
        queryKey: ['monsterData'],
        queryFn: getMonsterListApi,
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataMonsterValue, error: errorMonsterValue } = useQuery({
        queryKey: ['monsterValueData'],
        queryFn: getMonsterValueApi,
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataMonsterDetail, error: errorMonsterDetail } = useQuery({
        queryKey: ['monsterDetailData', locale],
        queryFn: () =>
            fetchMonsterByIdsNative(
                dataMonster!.list.map((item) => item.id),
                listCurrentLanguageApi[locale.toLowerCase()]
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!dataMonster,
    });

    useEffect(() => {
        if (dataMonster && !errorMonster) {
            setListMonster(dataMonster.list.sort((a, b) => Number(b.id) - Number(a.id)))
            setAllMapMonster(dataMonster.map)
        } else if (errorMonster) {
            toast.error("Failed to load monster data")
        }
    }, [dataMonster, errorMonster, setAllMapMonster, setListMonster])

    useEffect(() => {
        if (dataMonsterValue && !errorMonsterValue) {
            setAllMapMonsterValue(dataMonsterValue)
        } else if (errorMonsterValue) {
            toast.error("Failed to load monster value data")
        }
    }, [dataMonsterValue, errorMonsterValue, setAllMapMonsterValue])

    useEffect(() => {
        if (dataMonsterDetail && !errorMonsterDetail) {
            setAllMapMonsterInfo(dataMonsterDetail)
        } else if (errorMonsterDetail) {
            toast.error("Failed to load monster detail data")
        }
    }, [dataMonsterDetail, errorMonsterDetail, setAllMapMonsterInfo])
}
