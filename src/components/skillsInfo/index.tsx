"use client"

import { useTranslations } from "next-intl";
import useAvatarStore from "@/stores/avatarStore";
import { useCallback, useMemo } from "react";
import { traceButtonsInfo, traceLink } from "@/constant/traceConstant";
import useUserDataStore from "@/stores/userDataStore";
import useLocaleStore from "@/stores/localeStore";
import Image from "next/image";
import { replaceByParam } from "@/helper";
import { mappingStats } from "@/constant/constant";
import { StatusAddType } from "@/types";
import { toast } from "react-toastify";

export default function SkillsInfo() {
    const transI18n = useTranslations("DataPage")
    const { theme } = useLocaleStore()
    const { avatarSelected, mapAvatarInfo, skillSelected, setSkillSelected } = useAvatarStore()
    const { avatars, setAvatar } = useUserDataStore()

    const traceButtons = useMemo(() => {
        if (!avatarSelected) return
        return traceButtonsInfo[avatarSelected.baseType]
    }, [avatarSelected])

    const avatarInfo = useMemo(() => {
        if (!avatarSelected) return
        return mapAvatarInfo[avatarSelected.id]
    }, [avatarSelected, mapAvatarInfo])

    const avatarData = useMemo(() => {
        if (!avatarSelected) return
        return avatars[avatarSelected.id]
    }, [avatarSelected, avatars])

    const avatarSkillTree = useMemo(() => {
        if (!avatarSelected || !avatars[avatarSelected.id]) return {}
        if (avatars[avatarSelected.id].enhanced) {
            return avatarInfo?.Enhanced[avatars[avatarSelected.id].enhanced.toString()].SkillTrees || {}
        }
        return avatarInfo?.SkillTrees || {}
    }, [avatarSelected, avatarInfo, avatars])

    const skillInfo = useMemo(() => {
        if (!avatarSelected || !skillSelected) return
        return avatarSkillTree?.[skillSelected || ""]?.["1"]
    }, [avatarSelected, avatarSkillTree, skillSelected])

    const getImageSkill = useCallback((icon: string | undefined, status: StatusAddType | undefined, provider: string = "hakushin") => {
        if (!icon) return
        let urlPrefix = "https://homdgcat.wiki/images/skillicons/avatar/";
        if (provider === "hakushin") {
            urlPrefix = "https://api.hakush.in/hsr/UI/skillicons/"
        }
        if (icon.startsWith("SkillIcon")) {
            if (provider === "homdgcat") {
                return `${urlPrefix}${avatarSelected?.id}/${icon}`
            } else if (provider === "hakushin") {
                return `${urlPrefix}${icon.replace(".png", ".webp")}`
            }
        } else if (status && mappingStats[status.PropertyType]) {
            return mappingStats[status.PropertyType].icon
        }
        else if (icon.startsWith("Icon")) {
            return `https://api.hakush.in/hsr/UI/trace/${icon.replace(".png", ".webp")}`
        }
    }, [avatarSelected])

    const getTraceBuffDisplay = useCallback((status: StatusAddType) => {
        const dataDisplay = mappingStats[status.PropertyType]
        if (!dataDisplay) return ""
        if (dataDisplay.unit === "%") {
            return `${(status.Value * 100).toFixed(1)}${dataDisplay.unit}`
        }
        if (dataDisplay.name === "SPD") {
            return `${status.Value.toFixed(1)}${dataDisplay.unit}`
        }
        return `${status.Value.toFixed(0)}${dataDisplay.unit}`
    }, [])

    const dataLevelUpSkill = useMemo(() => {
        const skillIds: number[] = skillInfo?.LevelUpSkillID || []
        if (!avatarSelected || !avatarInfo || !avatarData) return
        let result = Object.values(avatarInfo.Skills || {})?.filter((skill) => skillIds.includes(skill.Id))
        if (avatarData.enhanced) {
            result = Object.values(avatarInfo.Enhanced[avatarData.enhanced.toString()].Skills || {})?.filter((skill) => skillIds.includes(skill.Id))
        }
        if (result && result.length > 0) {
            return {
                isServant: false,
                data: result,
                servantData: null,
            }
        }
        const resultServant = Object.entries(avatarInfo.Memosprite?.Skills || {})
            ?.filter(([skillId]) => skillIds.includes(Number(skillId)))
            ?.map(([skillId, skillData]) => ({
                Id: Number(skillId),
                ...skillData,
            }))
        if (resultServant && resultServant.length > 0) {
            return {
                isServant: true,
                data: resultServant,
                servantData: avatarInfo.Memosprite,
            }
        }
        return undefined
    }, [skillInfo?.LevelUpSkillID, avatarSelected, avatarInfo, avatarData])


    const handlerMaxAll = () => {
        if (!avatarInfo || !avatarData || !avatarSkillTree) {
            toast.error(transI18n("maxAllFailed"))
            return
        }
        const newData = structuredClone(avatarData)
        newData.data.skills = Object.values(avatarSkillTree).reduce((acc, dataPointEntry) => {
            const firstEntry = Object.values(dataPointEntry)[0];
            if (firstEntry) {
                acc[firstEntry.PointID] = firstEntry.MaxLevel;
            }
            return acc;
        }, {} as Record<string, number>)
        toast.success(transI18n("maxAllSuccess"))
        setAvatar(newData)
    }

    const handlerChangeStatusTrace = (status: boolean) => {
        if (!avatarData || !skillInfo) return
        const newData = structuredClone(avatarData)
        newData.data.skills[skillInfo?.PointID] = status ? 1 : 0

        if (!status && traceLink?.[avatarSelected?.baseType || ""]?.[skillSelected || ""]) {
            traceLink[avatarSelected?.baseType || ""][skillSelected || ""].forEach((pointId) => {
                if (avatarSkillTree?.[pointId]?.["1"]) {
                    newData.data.skills[avatarSkillTree?.[pointId]?.["1"].PointID] = 0
                }
            })
        }
        setAvatar(newData)
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded-xl p-6 shadow-lg">
                    <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-base-content">
                        <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                        {transI18n("skills")}
                    </h2>
                    <div className="flex flex-col items-center">
                        <button className="btn btn-success" onClick={handlerMaxAll}>{transI18n("maxAll")}</button>
                        {traceButtons && avatarInfo && (
                            <div className="grid col-span-4 relative w-full aspect-square">
                                <Image
                                    src={`/skilltree/${avatarSelected?.baseType?.toUpperCase()}.webp`}
                                    alt=""
                                    width={312}
                                    priority={true}
                                    height={312}
                                    style={{
                                        filter: (theme === "winter" || theme === "cupcake") ? "invert(1)" : "none"
                                    }}
                                    className={`w-full h-full object-cover rounded-xl`}
                                />
                                {traceButtons.map((btn, index) => {
                                    if (!avatarInfo?.SkillTrees?.[btn.id]) {
                                        return null
                                    }
                                    return (
                                        <div
                                            key={`${btn.id} + ${index}`}
                                            id={btn.id}
                                            className={`
                                            absolute rounded-full border border-black 
                                            bg-no-repeat bg-contain 
                                            cursor-pointer transition-all duration-200 ease-in-out 
                                            shadow-[0_0_5px_white] flex justify-center items-center 
                                            hover:scale-110z-10
                                            ${btn.size === "small" ? "w-[6vw] h-[6vw] md:w-[2vw] md:h-[2vw] bg-white" : ""}
                                            ${btn.size === "medium" ? "w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw] bg-white" : ""}
                                            ${btn.size === "big" ? "w-[9vw] h-[9vw] md:w-[3.5vw] md:h-[3.5vw] bg-black" : ""}
                                            ${btn.size === "special" ? "w-[9vw] h-[9vw] md:w-[3.5vw] md:h-[3.5vw] bg-white" : ""}
                                            ${btn.size === "memory" ? "w-[9vw] h-[9vw] md:w-[3.5vw] md:h-[3.5vw] bg-black" : ""}
                                            ${skillSelected === btn.id ? "border-4 border-primary" : ""}
                                            ${!avatarData?.data.skills?.[avatarSkillTree?.[btn.id]?.["1"]?.PointID]
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""}
                                        `}
                                            onClick={() => {
                                                setSkillSelected(btn.id === skillSelected ? null : btn.id)
                                            }}
                                            style={{
                                                left: btn.left,
                                                top: btn.top,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            <Image
                                                src={getImageSkill(avatarInfo?.SkillTrees?.[btn.id]?.["1"]?.Icon, avatarSkillTree?.[btn.id]?.["1"]?.StatusAddList[0]) || ""}
                                                alt={btn.id.replaceAll("Point", "")}
                                                priority={true}
                                                width={124}
                                                height={124}
                                                style={{
                                                    filter: (btn.size !== "big" && btn.size !== "memory") ? "brightness(0%)" : ""
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = getImageSkill(avatarInfo?.SkillTrees?.[btn.id]?.["1"]?.Icon, avatarSkillTree?.[btn.id]?.["1"]?.StatusAddList[0], "homdgcat") || "";
                                                }}
                                            />
                                            {(btn.size === "big" || btn.size === "memory")  && (
                                                <p className="
                                                z-12 text-sm sm:text-xs lg:text-sm xl:text-base 2xl:text-2xl
                                                font-bold text-center rounded-full absolute
                                                translate-y-full mt-1
                                                bg-base-300 px-1
                                                left-1/2 transform -translate-x-1/2
                                                ">
                                                    {`${avatarData?.data.skills?.[avatarSkillTree?.[btn.id]?.["1"]?.PointID] || 0}/${avatarSkillTree?.[btn.id]?.["1"]?.MaxLevel}`}
                                                </p>

                                            )}
                                            {btn.size === "special" && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        backgroundColor: "#4a6eff",
                                                        mixBlendMode: "screen",
                                                        opacity: 0.8,
                                                        borderRadius: "50%"
                                                    }}
                                                />
                                            )}
                                            {btn.size === "memory" && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        backgroundColor: "#9a89ff",
                                                        mixBlendMode: "screen",
                                                        opacity: 0.4,
                                                        borderRadius: "50%"
                                                    }}
                                                />
                                            )}
                                            {btn.size === "big" && (
                                                <div
                                                    style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    backgroundColor: "#f5e4b0",
                                                    mixBlendMode: "screen",
                                                    opacity: 0.3,
                                                    borderRadius: "50%"
                                                    }}
                                                />
                                            )}
                                        </div>


                                    )
                                })}
                            </div>
                        )}
                    </div>

                </div>
                <div className="bg-base-100 rounded-xl p-6 shadow-lg">
                    <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-base-content">
                        <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                        {transI18n("details")}
                    </h2>
                    {skillSelected && avatarInfo?.SkillTrees && avatarData && (
                        <div>
                            {skillInfo?.MaxLevel && skillInfo?.MaxLevel > 1 ? (
                                <div>
                                    <div className="font-bold text-success">{transI18n("level")}</div>
                                    <div className="w-full max-w-xs">
                                        <input type="range"
                                            min={1}
                                            max={skillInfo?.MaxLevel || 1}
                                            value={avatarData?.data.skills?.[skillInfo?.PointID] || 1}
                                            onChange={(e) => {
                                                const newData = structuredClone(avatarData)
                                                newData.data.skills[skillInfo?.PointID] = parseInt(e.target.value)
                                                setAvatar(newData)
                                            }}
                                            className="range range-success"
                                            step="1" />
                                        <div className="flex justify-between px-2.5 mt-2 text-xs">
                                            {Array.from({ length: skillInfo?.MaxLevel }, (_, index) => index + 1).map((index) => (
                                                <span key={index}>{index}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : skillInfo?.MaxLevel && skillInfo?.MaxLevel === 1 && traceButtons?.find((btn) => btn.id === skillSelected)?.size !== "big" ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={avatarData?.data.skills?.[skillInfo?.PointID] === 1}
                                        className="toggle toggle-success"
                                        onChange={(e) => {
                                            if (traceButtons?.find((btn) => btn.id === skillSelected)?.size === "special") {
                                                if (e.target.checked) {
                                                    const newData = structuredClone(avatarData)
                                                    newData.data.skills[skillInfo?.PointID] = 1
                                                    setAvatar(newData)
                                                    return
                                                }
                                                const newData = structuredClone(avatarData)
                                                delete newData.data.skills[skillInfo?.PointID]
                                                setAvatar(newData)
                                                return
                                            }
                                            handlerChangeStatusTrace(e.target.checked)
                                        }}
                                    />
                                    <div className="font-bold text-success">
                                        {avatarData?.data.skills?.[skillInfo?.PointID] === 1 ? transI18n("active") : transI18n("inactive")}
                                    </div>
                                </div>
                            ) : (
                                null
                            )}

                            {((skillInfo?.PointName && skillInfo?.PointDesc) ||
                                (skillInfo?.PointName && skillInfo?.StatusAddList.length > 0))
                                && (
                                    <div className="text-xl font-bold flex items-center gap-2 mt-2">
                                        {skillInfo.PointName}
                                        {skillInfo.StatusAddList.length > 0 && (
                                            <div>
                                                {skillInfo.StatusAddList.map((status, index) => (
                                                    <div key={index}>
                                                        <div className="text-xl font-bold">{getTraceBuffDisplay(status)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                            {skillInfo?.PointDesc && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: replaceByParam(
                                            skillInfo?.PointDesc || "",
                                            skillInfo?.ParamList || []
                                        )
                                    }}
                                />
                            )}

                            {skillInfo?.LevelUpSkillID
                                && skillInfo?.LevelUpSkillID.length > 0
                                && dataLevelUpSkill
                                && (
                                    <div className="mt-2 flex flex-col gap-2">

                                        {dataLevelUpSkill?.data?.map((skill, index) => (
                                            <div key={index}>

                                                <div className="text-xl font-bold text-primary">
                                                    {transI18n(dataLevelUpSkill.isServant ? `${skill?.Type ? "severaltalent" : "servantskill"}` : `${skill?.Type ? skill?.Type.toLowerCase() : "talent"}`)}
                                                    {` (${transI18n(skill.Tag.toLowerCase())})`}
                                                </div>

                                                <div className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: replaceByParam(skill.Name, []) }}>

                                                </div>

                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: replaceByParam(
                                                            skill.Desc || skill.SimpleDesc,
                                                            skill.Level[avatarData?.data.skills?.[skillInfo?.PointID]?.toString() || ""]?.ParamList || []
                                                        )
                                                    }}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}