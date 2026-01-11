"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchChangelog } from '@/lib/api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useModelStore from '@/stores/modelStore'
import useLocaleStore from '@/stores/localeStore'

export const useFetchChangelog = () => {
    const { currentVersion, setChangelog, setCurrentVersion } = useLocaleStore()
    const { setIsChangelog } = useModelStore()
    const { data: dataChangelog, error: errorChangelog } = useQuery({
        queryKey: ['changelog'],
        queryFn: fetchChangelog,
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (dataChangelog && !errorChangelog) {
            setChangelog(dataChangelog)
            if (dataChangelog?.[0] && dataChangelog[0].version != currentVersion) {
                setIsChangelog(true)
                setCurrentVersion(dataChangelog[0].version)
            }
        } else if (errorChangelog) {
            toast.error("Failed to load changelog data")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataChangelog, errorChangelog, setChangelog, setCurrentVersion, setIsChangelog])

}
