"use client"

import { useEffect } from "react"
import Image from "next/image";
import useLocaleStore from "@/stores/localeStore"
import useLightconeStore from "@/stores/lightconeStore";
import LightconeCard from "../card/lightconeCard";
import useUserDataStore from "@/stores/userDataStore";
import useAvatarStore from "@/stores/avatarStore";
import useModelStore from "@/stores/modelStore";
import { useTranslations } from "next-intl";

export default function LightconeBar() {
    const { locale } = useLocaleStore()
    const { 
        listLightcone, 
        filter, 
        setFilter, 
        defaultFilter, 
        listPath, 
        listRank, 
        setListPath, 
        setListRank 
    } = useLightconeStore()
    const { setAvatar, avatars } = useUserDataStore()
    const { avatarSelected } = useAvatarStore()
    const { setIsOpenLightcone } = useModelStore()
    const transI18n = useTranslations("DataPage")

    useEffect(() => {
        const newListPath: Record<string, boolean> = { "knight": false, "mage": false, "priest": false, "rogue": false, "shaman": false, "warlock": false, "warrior": false, "memory": false }
        const newListRank: Record<string, boolean> = { "3": false, "4": false, "5": false }
        for (const path of defaultFilter.path) {
            if (path in newListPath) {
                newListPath[path] = true
            }
        }
        for (const rarity of defaultFilter.rarity) {
            if (rarity in newListRank) {
                newListRank[rarity] = true
            }
        }
        setListPath(newListPath)
        setListRank(newListRank)
    }, [defaultFilter, setListPath, setListRank])

    useEffect(() => {
        setFilter({
            ...filter,
            locale: locale,
            path: Object.keys(listPath).filter((key) => listPath[key]),
            rarity: Object.keys(listRank).filter((key) => listRank[key])
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listPath, listRank, locale])

    return (
        <div>
            <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
                <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-cyan-400">
                    {transI18n("lightConeSetting")}
                </h3>
            </div>
            <div className="mt-2 w-full">
                <div className="flex items-start flex-col gap-2">
                    <div>Search</div>
                    <input
                        value={filter.name}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value, locale: locale })}
                        type="text" placeholder="LightCone Name" className="input input-accent mt-1 w-full"
                    />
                </div>
                <div className="flex items-start flex-col gap-2 mt-2 w-full">
                    <div>Filter</div>
                    <div className="flex flex-row flex-wrap justify-between mt-1 w-full">
                        {/* Nhóm 1 - Path icons */}
                        <div className="flex flex-wrap mb-1 mx-1 gap-2">
                            {Object.keys(listPath).map((key, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setListPath({ ...listPath, [key]: !listPath[key] })
                                    }}
                                    className="h-[38px] w-[38px] md:h-[50px] md:w-[50px] hover:bg-gray-600 grid place-items-center rounded-md shadow-lg cursor-pointer"
                                    style={{
                                        backgroundColor: listPath[key] ? "#374151" : "#6B7280"
                                    }}
                                >
                                    <Image
                                        src={`/icon/${key}.webp`}
                                        alt={key}
                                        className="h-[28px] w-[28px] md:h-[32px] md:w-[32px] object-contain rounded-md"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Nhóm 2 - Rank icons */}
                        <div className="flex flex-wrap mb-1 mx-1 gap-2">
                            {Object.keys(listRank).map((key, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setListRank({ ...listRank, [key]: !listRank[key] })
                                    }}
                                    className="h-[38px] w-[38px] md:h-[50px] md:w-[50px] hover:bg-gray-600 grid place-items-center rounded-md shadow-lg cursor-pointer"
                                    style={{
                                        backgroundColor: listRank[key] ? "#374151" : "#6B7280"
                                    }}
                                >
                                    <div className="font-bold text-white h-[32px] w-[32px] text-center flex items-center justify-center">
                                        {key}*
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 mt-2 gap-2">
                {listLightcone.map((item, index) => (
                    <div key={index} onClick={() => {
                        if (avatarSelected) {
                            const avatar = avatars[avatarSelected.id]
                            avatar.profileList[avatar.profileSelect].lightcone = {
                                level: 80,
                                item_id: Number(item.id),
                                rank: 1,
                                promotion: 6
                            }
                            setAvatar({ ...avatar })
                            setIsOpenLightcone(false)
                        }
                    }}>
                        <LightconeCard data={item} />
                    </div>
                ))}
            </div>
        </div>
    )
}