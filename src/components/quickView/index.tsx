"use client"
import NextImage from "next/image"
import useLightconeStore from "@/stores/lightconeStore";
import useAffixStore from "@/stores/affixStore";
import useUserDataStore from "@/stores/userDataStore";
import useRelicStore from "@/stores/relicStore";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import useAvatarStore from "@/stores/avatarStore";
import { calcAffixBonus, calcBaseStatRaw, calcBonusStatRaw, calcMainAffixBonus, calcMainAffixBonusRaw, calcPromotion, calcSubAffixBonusRaw, replaceByParam } from "@/helper";
import { mappingStats } from "@/constant/constant";
import RelicShowcase from "../showcaseCard/relicShowcase";
export default function QuickView() {
    const { avatarSelected, mapAvatarInfo } = useAvatarStore()
    const { mapLightconeInfo } = useLightconeStore()
    const { mapMainAffix, mapSubAffix } = useAffixStore()
    const { avatars } = useUserDataStore()
    const transI18n = useTranslations("DataPage")
    const { mapRelicInfo } = useRelicStore()

    const avatarInfo = useMemo(() => {
        if (!avatarSelected) return
        return mapAvatarInfo[avatarSelected.id]
    }, [avatarSelected, mapAvatarInfo])

    const avatarSkillTree = useMemo(() => {
        if (!avatarSelected || !avatars[avatarSelected.id]) return {}
        if (avatars[avatarSelected.id].enhanced) {
            return avatarInfo?.Enhanced[avatars[avatarSelected.id].enhanced.toString()].SkillTrees || {}
        }
        return avatarInfo?.SkillTrees || {}
    }, [avatarSelected, avatarInfo, avatars])

    const avatarData = useMemo(() => {
        if (!avatarSelected) return
        return avatars[avatarSelected.id]
    }, [avatarSelected, avatars])

    const avatarProfile = useMemo(() => {
        if (!avatarSelected || !avatarData) return
        return avatarData?.profileList?.[avatarData?.profileSelect]
    }, [avatarSelected, avatarData])

    const relicEffects = useMemo(() => {
        const avatar = avatars[avatarSelected?.id || ""];
        const relicCount: { [key: string]: number } = {};
        if (avatar) {
            for (const relic of Object.values(avatar.profileList[avatar.profileSelect].relics)) {
                if (relicCount[relic.relic_set_id]) {
                    relicCount[relic.relic_set_id]++;
                } else {
                    relicCount[relic.relic_set_id] = 1;
                }
            }
        }
        const listEffects: { key: string, count: number }[] = [];
        Object.entries(relicCount).forEach(([key, value]) => {
            if (value >= 2) {
                listEffects.push({ key: key, count: value });
            }
        });
        return listEffects;
    }, [avatars, avatarSelected]);

    const relicStats = useMemo(() => {
        if (!avatarSelected || !avatarProfile?.relics || !mapMainAffix || !mapSubAffix) return

        return Object.entries(avatarProfile?.relics).map(([key, value]) => {
            const mainAffixMap = mapMainAffix["5" + key]
            const subAffixMap = mapSubAffix["5"]
            if (!mainAffixMap || !subAffixMap) return
            return {
                img: `https://api.hakush.in/hsr/UI/relicfigures/IconRelic_${value.relic_set_id}_${key}.webp`,
                mainAffix: {
                    property: mainAffixMap?.[value?.main_affix_id]?.property,
                    level: value?.level,
                    valueAffix: calcMainAffixBonus(mainAffixMap?.[value?.main_affix_id], value?.level),
                    detail: mappingStats?.[mainAffixMap?.[value?.main_affix_id]?.property]
                },
                subAffix: value?.sub_affixes?.map((subValue) => {
                    return {
                        property: subAffixMap?.[subValue?.sub_affix_id]?.property,
                        valueAffix: calcAffixBonus(subAffixMap?.[subValue?.sub_affix_id], subValue?.step, subValue?.count),
                        detail: mappingStats?.[subAffixMap?.[subValue?.sub_affix_id]?.property],
                        step: subValue?.step,
                        count: subValue?.count
                    }
                })
            }
        })
    }, [avatarSelected, avatarProfile, mapMainAffix, mapSubAffix])

    const characterStats = useMemo(() => {
        if (!avatarSelected || !avatarData) return
        const charPromotion = calcPromotion(avatarData.level)

        const statsData: Record<string, {
            value: number,
            base: number,
            name: string,
            icon: string,
            unit: string,
            round: number
        }> = {
            HP: {
                value: calcBaseStatRaw(
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.HPBase,
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.HPAdd,
                    avatarData.level
                ),
                base: calcBaseStatRaw(
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.HPBase,
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.HPAdd,
                    avatarData.level
                ),
                name: "HP",
                icon: "/icon/hp.webp",
                unit: "",
                round: 0
            },
            ATK: {
                value: calcBaseStatRaw(
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.AttackBase,
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.AttackAdd,
                    avatarData.level
                ),
                base: calcBaseStatRaw(
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.AttackBase,
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.AttackAdd,
                    avatarData.level
                ),
                name: "ATK",
                icon: "/icon/attack.webp",
                unit: "",
                round: 0
            },
            DEF: {
                value: calcBaseStatRaw(
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.DefenceBase,
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.DefenceAdd,
                    avatarData.level
                ),
                base: calcBaseStatRaw(
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.DefenceBase,
                    mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.DefenceAdd,
                    avatarData.level
                ),
                name: "DEF",
                icon: "/icon/defence.webp",
                unit: "",
                round: 0
            },
            SPD: {
                value: mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.SpeedBase || 0,
                base: mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.SpeedBase || 0,
                name: "SPD",
                icon: "/icon/speed.webp",
                unit: "",
                round: 1
            },
            CRITRate: {
                value: mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.CriticalChance || 0,
                base: mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.CriticalChance || 0,
                name: "CRIT Rate",
                icon: "/icon/crit-rate.webp",
                unit: "%",
                round: 1
            },
            CRITDmg: {
                value: mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.CriticalDamage || 0,
                base: mapAvatarInfo?.[avatarSelected.id]?.Stats[charPromotion]?.CriticalDamage || 0,
                name: "CRIT DMG",
                icon: "/icon/crit-damage.webp",
                unit: "%",
                round: 1
            },
            BreakEffect: {
                value: 0,
                base: 0,
                name: "Break Effect",
                icon: "/icon/break-effect.webp",
                unit: "%",
                round: 1
            },
            EffectRES: {
                value: 0,
                base: 0,
                name: "Effect RES",
                icon: "/icon/effect-res.webp",
                unit: "%",
                round: 1
            },
            EnergyRate: {
                value: 0,
                base: 0,
                name: "Energy Rate",
                icon: "/icon/energy-rate.webp",
                unit: "%",
                round: 1
            },
            EffectHitRate: {
                value: 0,
                base: 0,
                name: "Effect Hit Rate",
                icon: "/icon/effect-hit-rate.webp",
                unit: "%",
                round: 1
            },
            HealBoost: {
                value: 0,
                base: 0,
                name: "Healing Boost",
                icon: "/icon/healing-boost.webp",
                unit: "%",
                round: 1
            },
            PhysicalAdd: {
                value: 0,
                base: 0,
                name: "Physical Boost",
                icon: "/icon/physical-add.webp",
                unit: "%",
                round: 1
            },
            FireAdd: {
                value: 0,
                base: 0,
                name: "Fire Boost",
                icon: "/icon/fire-add.webp",
                unit: "%",
                round: 1
            },
            IceAdd: {
                value: 0,
                base: 0,
                name: "Ice Boost",
                icon: "/icon/ice-add.webp",
                unit: "%",
                round: 1
            },
            ThunderAdd: {
                value: 0,
                base: 0,
                name: "Thunder Boost",
                icon: "/icon/thunder-add.webp",
                unit: "%",
                round: 1
            },
            WindAdd: {
                value: 0,
                base: 0,
                name: "Wind Boost",
                icon: "/icon/wind-add.webp",
                unit: "%",
                round: 1
            },
            QuantumAdd: {
                value: 0,
                base: 0,
                name: "Quantum Boost",
                icon: "/icon/quantum-add.webp",
                unit: "%",
                round: 1
            },
            ImaginaryAdd: {
                value: 0,
                base: 0,
                name: "Imaginary Boost",
                icon: "/icon/imaginary-add.webp",
                unit: "%",
                round: 1
            },
        }

        if (avatarProfile?.lightcone && mapLightconeInfo[avatarProfile?.lightcone?.item_id]) {
            const lightconePromotion = calcPromotion(avatarProfile?.lightcone?.level)
            statsData.HP.value += calcBaseStatRaw(
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseHP,
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseHPAdd,
                avatarProfile?.lightcone?.level
            )
            statsData.HP.base += calcBaseStatRaw(
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseHP,
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseHPAdd,
                avatarProfile?.lightcone?.level
            )
            statsData.ATK.value += calcBaseStatRaw(
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseAttack,
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseAttackAdd,
                avatarProfile?.lightcone?.level
            )
            statsData.ATK.base += calcBaseStatRaw(
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseAttack,
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseAttackAdd,
                avatarProfile?.lightcone?.level
            )
            statsData.DEF.value += calcBaseStatRaw(
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseDefence,
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseDefenceAdd,
                avatarProfile?.lightcone?.level
            )
            statsData.DEF.base += calcBaseStatRaw(
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseDefence,
                mapLightconeInfo?.[avatarProfile?.lightcone?.item_id]?.Stats[lightconePromotion]?.BaseDefenceAdd,
                avatarProfile?.lightcone?.level
            )

            const bonusData = mapLightconeInfo[avatarProfile?.lightcone?.item_id].Bonus?.[avatarProfile?.lightcone.rank - 1]
            if (bonusData && bonusData.length > 0) {
                const bonusSpd = bonusData.filter((bonus) => bonus.type === "BaseSpeed")
                const bonusOther = bonusData.filter((bonus) => bonus.type !== "BaseSpeed")
                bonusSpd.forEach((bonus) => {
                    statsData.SPD.value += bonus.value
                    statsData.SPD.base += bonus.value
                })
                bonusOther.forEach((bonus) => {
                    const statsBase = mappingStats?.[bonus.type]?.baseStat
                    if (statsBase && statsData[statsBase]) {
                        statsData[statsBase].value += calcBonusStatRaw(bonus.type, statsData[statsBase].base, bonus.value)
                    }
                })
            }
        }
        if (avatarSkillTree) {
            Object.values(avatarSkillTree).forEach((value) => {
                if (value?.["1"]
                    && value?.["1"]?.PointID
                    && typeof avatarData?.data?.skills?.[value?.["1"]?.PointID] === "number"
                    && avatarData?.data?.skills?.[value?.["1"]?.PointID] !== 0
                    && value?.["1"]?.StatusAddList
                    && value?.["1"].StatusAddList.length > 0) {
                    value?.["1"]?.StatusAddList.forEach((status) => {
                        const statsBase = mappingStats?.[status?.PropertyType]?.baseStat
                        if (statsBase && statsData[statsBase]) {
                            statsData[statsBase].value += calcBonusStatRaw(status?.PropertyType, statsData[statsBase].base, status.Value)
                        }
                    })
                }
            })
        }



        if (avatarProfile?.relics && mapMainAffix && mapSubAffix) {
            Object.entries(avatarProfile?.relics).forEach(([key, value]) => {
                const mainAffixMap = mapMainAffix["5" + key]
                const subAffixMap = mapSubAffix["5"]
                if (!mainAffixMap || !subAffixMap) return
                const mainStats = mappingStats?.[mainAffixMap?.[value.main_affix_id]?.property]?.baseStat
                if (mainStats && statsData[mainStats]) {
                    statsData[mainStats].value += calcMainAffixBonusRaw(mainAffixMap?.[value.main_affix_id], value.level, statsData[mainStats].base)
                }
                value?.sub_affixes.forEach((subValue) => {
                    const subStats = mappingStats?.[subAffixMap?.[subValue.sub_affix_id]?.property]?.baseStat
                    if (subStats && statsData[subStats]) {
                        statsData[subStats].value += calcSubAffixBonusRaw(subAffixMap?.[subValue.sub_affix_id], subValue.step, subValue.count, statsData[subStats].base)
                    }
                })
            })
        }

        if (relicEffects && relicEffects.length > 0) {
            relicEffects.forEach((relic) => {
                const dataBonus = mapRelicInfo?.[relic.key]?.Bonus
                if (!dataBonus || Object.keys(dataBonus).length === 0) return
                Object.entries(dataBonus || {}).forEach(([key, value]) => {
                    if (relic.count < Number(key)) return
                    value.forEach((bonus) => {
                        const statsBase = mappingStats?.[bonus.type]?.baseStat
                        if (statsBase && statsData[statsBase]) {
                            statsData[statsBase].value += calcBonusStatRaw(bonus.type, statsData[statsBase].base, bonus.value)
                        }
                    })
                })
            })
        }


        return statsData
    }, [
        avatarSelected,
        avatarData,
        mapAvatarInfo,
        avatarProfile?.lightcone,
        avatarProfile?.relics,
        mapLightconeInfo,
        mapMainAffix,
        mapSubAffix,
        relicEffects,
        mapRelicInfo,
        avatarSkillTree
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 flex flex-col justify-between py-3">
                <div className="flex w-full flex-col justify-between gap-y-0.5 text-base">
                    {Object.entries(characterStats || {})?.map(([key, stat], index) => {
                        if (!stat || (key.includes("Add") && stat.value === 0)) return null
                        return (
                            <div key={index} className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center">
                                    <NextImage src={stat?.icon || ""} alt="Stat Icon" width={40} height={40} className="h-auto w-10 p-1 mx-1 bg-black/20 rounded-full" />
                                    <div className="font-bold">{stat.name}</div>
                                </div>
                                <div className="ml-3 mr-3 flex-grow border rounded opacity-50" />
                                <div className="flex cursor-default flex-col text-right font-bold">{
                                    stat.value ? stat.unit === "%" ? (stat.value * 100).toFixed(stat.round) : stat.value.toFixed(stat.round) : 0
                                }{stat.unit}</div>
                            </div>
                        )
                    })}
                    <hr />
                </div>

                <div className="flex flex-col items-center gap-1 w-full my-2">
                    {relicEffects.map((setEffect, index) => {
                        const relicInfo = mapRelicInfo[setEffect.key];
                        if (!relicInfo) return null;
                        return (
                            <div key={index} className="flex w-full flex-row justify-between text-left">
                                <div
                                    className="font-bold truncate max-w-full mr-1"
                                    style={{
                                        fontSize: 'clamp(0.5rem, 2vw, 1rem)'
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: replaceByParam(
                                            relicInfo.Name,
                                            []
                                        )
                                    }}
                                />
                                <div>
                                    <span className="black-blur bg-black/20 flex w-5 justify-center rounded px-1.5 py-0.5">{setEffect.count}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 justify-between py-3 text-lg">

                  {relicStats?.map((relic, index) => {
                    if (!relic) return null
                    return (
                      <div
                        key={index}
                        className="relative w-full flex flex-row items-center rounded-s-lg border-l-2 p-1 border-yellow-600/60  bg-gradient-to-r from-yellow-600/20 to-transparent"
                      >
                        {/* Subtle glow overlay */}
                        <div className="absolute inset-0 rounded-s-lg  pointer-events-none"></div>

                        <div className="flex relative">
                          <div className="absolute inset-0 rounded-lg blur-lg -z-10"></div>
                          <NextImage
                            src={relic?.img || ""}
                            width={78}
                            height={78}
                            alt="Relic Icon"
                            className="h-auto w-[78px] rounded-lg"
                          />

                          <div
                            className="absolute text-yellow-400 font-bold z-10 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                            style={{
                              left: '0.65rem',
                              bottom: '-0.45rem',
                              fontSize: '1.05rem',
                              letterSpacing: '-0.1em',
                            }}
                          >
                            ✦✦✦✦✦
                          </div>
                        </div>

                        <div className=" flex w-1/6 flex-col items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/15 rounded-full blur-md -z-10"></div>
                            <NextImage
                              src={relic?.mainAffix?.detail?.icon || ""}
                              width={35}
                              height={35}
                              alt="Main Affix Icon"
                              className="h-auto w-[35px]"
                            />
                          </div>
                          <span className="text-base text-yellow-400 font-semibold drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]">
                            {relic?.mainAffix?.valueAffix + relic?.mainAffix?.detail?.unit}
                          </span>
                          <span className="bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5 text-xs border border-white/10">
                            +{relic?.mainAffix?.level}
                          </span>
                        </div>

                        <div style={{ opacity: 0.3, height: '78px', borderLeftWidth: '1px' }}></div>

                        <div className="grid w-[65%] m-2 grid-cols-2 gap-1">
                          {relic?.subAffix?.map((subAffix, index) => {
                            if (!subAffix) return null
                            return (
                              <RelicShowcase key={index} relic={relic} />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}

                  {(!relicStats || !relicStats?.length) && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-center p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                        <span className="text-lg text-gray-400">{transI18n("noRelicEquipped")}</span>
                      </div>
                    </div>
                  )}
            </div>
        </div>
    )
}