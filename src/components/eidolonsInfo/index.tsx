/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { replaceByParam } from "@/helper";
import useListAvatarStore from "@/stores/avatarStore";
import Image from "next/image";
import ParseText from "../parseText";
import useLocaleStore from "@/stores/localeStore";
import useUserDataStore from "@/stores/userDataStore";
import { useMemo } from "react";
import { useTranslations } from "next-intl";


export default function EidolonsInfo() {
    const { avatarSelected, mapAvatarInfo } = useListAvatarStore()
    const { locale } = useLocaleStore()
    const transI18n = useTranslations("DataPage")
    const { setAvatars, avatars } = useUserDataStore()

    const charRank = useMemo(() => {
        if (!avatarSelected) return null;
        const avatar = avatars[avatarSelected.id];
        if (avatar?.enhanced != "") {
            return mapAvatarInfo[avatarSelected.id]?.Enhanced[avatar?.enhanced].Ranks
        }
        return mapAvatarInfo[avatarSelected.id]?.Ranks
    }, [avatarSelected, avatars, locale, mapAvatarInfo]);

    return (
        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-base-content">
                <div className="w-2 h-6 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                {transI18n("eidolons")}
            </h2>
            <div className="grid grid-cols-1 m-4 p-4 font-bold gap-4 w-fit max-h-[77vh] min-h-[50vh] overflow-y-scroll overflow-x-hidden">
                {charRank && avatars[avatarSelected?.id || ""] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(charRank || {}).map(([key, rank]) => (
                            <div key={key}
                                className="flex flex-col items-center cursor-pointer hover:scale-105"
                                onClick={() => {
                                    let newRank = Number(key)
                                    if (avatars[avatarSelected?.id || ""]?.data?.rank == Number(key)) {
                                        newRank = Number(key) - 1
                                    }
                                    setAvatars({ ...avatars, [avatarSelected?.id || ""]: { ...avatars[avatarSelected?.id || ""], data: { ...avatars[avatarSelected?.id || ""].data, rank: newRank } } })
                                }}
                            >
                                <Image
                                    className={`w-60 object-contain mb-2 ${Number(key) <= avatars[avatarSelected?.id || ""]?.data?.rank ? "" : "grayscale"}`}
                                    src={`https://api.hakush.in/hsr/UI/rank/_dependencies/textures/${avatarSelected?.id}/${avatarSelected?.id}_Rank_${key}.webp`}
                                    alt={`Rank ${key}`}
                                    priority
                                    width={240}
                                    height={240}
                                />

                                <div className="text-lg pb-1 flex items-center justify-items-center gap-2">
                                    <span className="inline-block text-indigo-500">{key}.</span>
                                    <ParseText
                                        locale={locale}
                                        text={rank.Name}
                                        className="text-center text-base font-normal leading-tight"
                                    />
                                </div>
                                <div className="text-sm font-normal">
                                    <div dangerouslySetInnerHTML={{ __html: replaceByParam(rank.Desc, rank.ParamList) }} />
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}
