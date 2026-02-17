"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchRelicsApi } from '@/lib/api'
import { useEffect } from 'react'
import useRelicStore from '@/stores/relicStore'
import { listCurrentLanguageApi } from '@/constant/constant'
import useLocaleStore from '@/stores/localeStore'
import { toast } from 'react-toastify'

export const useFetchRelicData = () => {
    const { setAllMapRelicInfo } = useRelicStore()
    const { locale } = useLocaleStore()

    const { data: dataRelicInfo, error: errorRelicInfo } = useQuery({
        queryKey: ['relicInfoData', locale],
        queryFn: () =>
            fetchRelicsApi(
                listCurrentLanguageApi[locale.toLowerCase()]
            ),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (dataRelicInfo && !errorRelicInfo) {
            setAllMapRelicInfo(dataRelicInfo)
        } else if (errorRelicInfo) {
            toast.error("Failed to load relic info data")
        }

    }, [dataRelicInfo, errorRelicInfo, setAllMapRelicInfo])
}
