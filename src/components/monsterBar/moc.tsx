"use client"

import { useEffect, useMemo } from "react";
import SelectCustomText from "../select/customSelectText";
import { calcMonsterStats, getLocaleName, replaceByParam } from "@/helper";
import useLocaleStore from "@/stores/localeStore";
import useUserDataStore from "@/stores/userDataStore";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MonsterStore } from "@/types";
import useDetailDataStore from "@/stores/detailDataStore";

export default function MocBar() {
    const { locale } = useLocaleStore()
    const {
        moc_config,
        setMocConfig
    } = useUserDataStore()
    const { mapMonster, mapMoc, damageType, hardLevelConfig, eliteConfig } = useDetailDataStore()

    const transI18n = useTranslations("DataPage")

    const challengeSelected = useMemo(() => {
        return mapMoc[moc_config.event_id.toString()]?.Level.find((moc) => moc.ID === moc_config.challenge_id)
    }, [moc_config, mapMoc])

    const eventSelected = useMemo(() => {
        return mapMoc[moc_config.event_id.toString()]
    }, [moc_config, mapMoc])

    useEffect(() => {
        if (!challengeSelected || moc_config.event_id === 0 || moc_config.challenge_id === 0) return

        const newBattleConfig = structuredClone(moc_config)
        newBattleConfig.cycle_count = 0
        if (moc_config.use_cycle_count) {
            newBattleConfig.cycle_count = challengeSelected.TurnLimit
        }
        newBattleConfig.blessings = []
        if (moc_config.use_turbulence_buff && challengeSelected) {
            challengeSelected.MazeBuff.map((item) => {
                newBattleConfig.blessings.push({
                    id: item.ID,
                    level: 1
                })
            })
        }
        newBattleConfig.monsters = []
        newBattleConfig.stage_id = 0
        if ((moc_config.floor_side === "Upper" || moc_config.floor_side === "Upper -> Lower") && challengeSelected.EventList1.length > 0) {
            newBattleConfig.stage_id = challengeSelected.EventList1[0].ID
            for (const wave of challengeSelected.EventList1[0].MonsterList) {
                const newWave: MonsterStore[] = []
                for (const value of Object.values(wave)) {
                    newWave.push({
                        monster_id: value,
                        level: challengeSelected.EventList1[0].Level,
                        amount: 1,
                    })
                }
                newBattleConfig.monsters.push(newWave)
            }
        }
        if ((moc_config.floor_side === "Lower" || moc_config.floor_side === "Lower -> Upper") && challengeSelected.EventList2.length > 0) {
            newBattleConfig.stage_id = challengeSelected.EventList2[0].ID
            for (const wave of challengeSelected.EventList2[0].MonsterList) {
                const newWave: MonsterStore[] = []
                for (const value of Object.values(wave)) {
                    newWave.push({
                        monster_id: value,
                        level: challengeSelected.EventList2[0].Level,
                        amount: 1,
                    })
                }
                newBattleConfig.monsters.push(newWave)
            }
        }
        if (moc_config.floor_side === "Lower -> Upper" && challengeSelected.EventList1.length > 0) {
            for (const wave of challengeSelected.EventList1[0].MonsterList) {
                const newWave: MonsterStore[] = []
                for (const value of Object.values(wave)) {
                    newWave.push({
                        monster_id: value,
                        level: challengeSelected.EventList1[0].Level,
                        amount: 1,
                    })
                }
                newBattleConfig.monsters.push(newWave)
            }
        } else if (moc_config.floor_side === "Upper -> Lower" && challengeSelected.EventList2.length > 0) {
            for (const wave of challengeSelected.EventList2[0].MonsterList) {
                const newWave: MonsterStore[] = []
                for (const value of Object.values(wave)) {
                    newWave.push({
                        monster_id: value,
                        level: challengeSelected.EventList2[0].Level,
                        amount: 1,
                    })
                }
                newBattleConfig.monsters.push(newWave)
            }
        }
        setMocConfig(newBattleConfig)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        moc_config.event_id,
        moc_config.challenge_id,
        moc_config.floor_side,
        moc_config.use_cycle_count,
        moc_config.use_turbulence_buff,
        mapMoc,
    ])

    if (!mapMoc) return null

    return (
        <div className="py-8 relative">

            {/* Title Card */}
            <div className="rounded-xl p-4 mb-2 border border-warning">
                <div className="mb-4 w-full">
                    <SelectCustomText
                        customSet={Object.values(mapMoc).sort((a, b) => b.ID - a.ID).map((moc) => ({
                            id: moc.ID.toString(),
                            name: getLocaleName(locale, moc.Name),
                            time: `${moc.BeginTime} - ${moc.EndTime}`,
                        }))}
                        excludeSet={[]}
                        selectedCustomSet={moc_config.event_id.toString()}
                        placeholder={transI18n("selectMOCEvent")}
                        setSelectedCustomSet={(id) => setMocConfig({
                            ...moc_config,
                            event_id: Number(id),
                            challenge_id: mapMoc[Number(id)]?.Level.at(-1)?.ID || 0,
                        })}
                    />
                </div>
                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                    <div className="flex items-center gap-2">
                        <label className="label">
                            <span className="label-text font-bold text-success">{transI18n("floor")}:{" "}</span>
                        </label>
                        <select
                            value={moc_config.challenge_id}
                            className="select select-success"
                            onChange={(e) => setMocConfig({
                                ...moc_config,
                                challenge_id: Number(e.target.value)
                            })}
                        >
                            <option value={0} disabled={true}>Select a Floor</option>
                            {eventSelected?.Level?.map((moc) => (
                                <option key={moc.ID} value={moc.ID}>{getLocaleName(locale, moc.Name)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="label">
                            <span className="label-text font-bold text-success">{transI18n("side")}:{" "}</span>
                        </label>
                        <select
                            value={moc_config.floor_side}
                            className="select select-success"
                            onChange={(e) => setMocConfig({ ...moc_config, floor_side: e.target.value })}
                        >
                            <option value={0} disabled={true}>{transI18n("selectSide")}</option>
                            <option value="Upper">{transI18n("upper")}</option>
                            <option value="Lower">{transI18n("lower")}</option>
                            <option value="Upper -> Lower">{transI18n("upperToLower")}</option>
                            <option value="Lower -> Upper">{transI18n("lowerToUpper")}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="label cursor-pointer">
                            <span
                                onClick={() => setMocConfig({ ...moc_config, use_cycle_count: !moc_config.use_cycle_count })}
                                className="label-text font-bold text-success cursor-pointer"
                            >
                                {transI18n("useCycleCount")} {" "}
                            </span>
                            <input
                                type="checkbox"
                                checked={moc_config.use_cycle_count}
                                onChange={(e) => setMocConfig({ ...moc_config, use_cycle_count: e.target.checked })}
                                className="checkbox checkbox-primary"
                            />
                        </label>
                    </div>
                </div>

                {/* Turbulence Buff */}
                <div className="bg-base-200/20 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            checked={moc_config.use_turbulence_buff}
                            onChange={(e) => setMocConfig({ ...moc_config, use_turbulence_buff: e.target.checked })}
                            className="checkbox checkbox-primary"
                        />
                        <span
                            onClick={() => setMocConfig({ ...moc_config, use_turbulence_buff: !moc_config.use_turbulence_buff })}
                            className="font-bold text-success cursor-pointer">
                            {transI18n("useTurbulenceBuff")}
                        </span>
                    </div>
                    {challengeSelected ? (
                        challengeSelected.MazeBuff.map((buff, i) => (
                            <div
                                key={i}
                                className="text-base"
                                dangerouslySetInnerHTML={{
                                    __html: replaceByParam(
                                        getLocaleName(locale, buff?.Desc) || "",
                                        buff?.Param || []
                                    )
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-base">{transI18n("noTurbulenceBuff")}</div>
                    )}
                </div>
            </div>

            {/* Enemy Waves */}
            {(moc_config?.challenge_id ?? 0) !== 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* First Half */}
                    <div className="rounded-xl p-4 mt-2 border border-warning">
                        <h2 className="text-2xl font-bold mb-6 text-info">{transI18n("firstHalfEnemies")}</h2>

                        {challengeSelected && challengeSelected?.EventList1?.length > 0 && challengeSelected?.EventList1?.[0]?.MonsterList?.map((wave, waveIndex) => (
                            <div key={waveIndex} className="mb-6">
                                <h3 className="text-lg font-semibold">{transI18n("wave")} {waveIndex + 1}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.values(wave).map((waveValue, enemyIndex) => {
                                        const monsterStats = calcMonsterStats(
                                            mapMonster?.[waveValue.toString()],
                                            challengeSelected?.EventList1?.[0]?.EliteGroup,
                                            challengeSelected?.EventList1?.[0]?.HardLevelGroup,
                                            challengeSelected?.EventList1?.[0]?.Level,
                                            hardLevelConfig,
                                            eliteConfig
                                        );
                                        return (
                                            <div
                                                key={enemyIndex}
                                                className="group relative flex flex-col w-40 bg-base-100 rounded-2xl border border-base-300 shadow-md"
                                            >
                                                <div className="badge badge-warning badge-sm font-bold absolute top-2 right-2 z-10 shadow-sm">
                                                    Lv. {challengeSelected?.EventList1[0].Level}
                                                </div>

                                                <div className="relative w-full h-20 bg-base-200 flex items-center justify-center p-4 rounded-t-2xl">
                                                    {mapMonster?.[waveValue.toString()]?.Image?.IconPath && (
                                                        <div className="relative w-16 h-16 rounded-full border-2 border-base-300 shadow-md overflow-hidden group-hover:scale-110 transition-transform duration-300 bg-base-100">
                                                            <Image
                                                                unoptimized
                                                                crossOrigin="anonymous"
                                                                src={`${process.env.CDN_URL}/${mapMonster?.[waveValue.toString()]?.Image?.IconPath}`}
                                                                alt="Enemy Icon"
                                                                width={150}
                                                                height={150}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col px-1 pb-2 pt-2">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <div className="flex justify-between items-center bg-base-200 px-2.5 py-1.5 rounded-lg">
                                                            <span className="text-xs font-semibold text-error">HP</span>
                                                            <span className="text-sm font-bold text-base-content">{monsterStats.hp.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        </div>

                                                        <div className="flex justify-between items-center bg-base-200 px-2.5 py-1.5 rounded-lg">
                                                            <span className="text-xs font-semibold text-info">Speed</span>
                                                            <span className="text-sm font-bold text-base-content">{monsterStats.spd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        </div>

                                                        <div className="flex justify-between items-center bg-base-200 px-2.5 py-1.5 rounded-lg">
                                                            <span className="text-xs font-semibold text-base-content/70">Toughness</span>
                                                            <span className="text-sm font-bold text-base-content">{monsterStats.stance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 pt-2 border-t border-base-300 flex flex-col items-center">
                                                        <span className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest mb-1.5">
                                                            Weakness
                                                        </span>
                                                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                            {mapMonster?.[waveValue.toString()]?.StanceWeakList?.map((icon, iconIndex) => (
                                                                <Image
                                                                    key={iconIndex}
                                                                    unoptimized
                                                                    crossOrigin="anonymous"
                                                                    src={`${process.env.CDN_URL}/${damageType[icon]?.Icon}`}
                                                                    alt={icon}
                                                                    width={40}
                                                                    height={40}
                                                                    className="h-6 w-6 object-contain rounded-full bg-base-300 border border-base-content/10 p-0.5 shadow-sm hover:scale-110 transition-transform"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second Half */}
                    <div className="rounded-xl p-4 mt-2 border border-warning">
                        <h2 className="text-2xl font-bold mb-6 text-info">{transI18n("secondHalfEnemies")}</h2>

                        {challengeSelected && challengeSelected?.EventList2?.length > 0 && challengeSelected?.EventList2?.[0]?.MonsterList?.map((wave, waveIndex) => (
                            <div key={waveIndex} className="mb-6">
                                <h3 className="text-lg font-semibold">{transI18n("wave")} {waveIndex + 1}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.values(wave).map((waveValue, enemyIndex) => {
                                        const monsterStats = calcMonsterStats(
                                            mapMonster?.[waveValue.toString()],
                                            challengeSelected?.EventList2?.[0]?.EliteGroup,
                                            challengeSelected?.EventList2?.[0]?.HardLevelGroup,
                                            challengeSelected?.EventList2?.[0]?.Level,
                                            hardLevelConfig,
                                            eliteConfig
                                        );
                                        return (
                                            <div
                                                key={enemyIndex}
                                                className="group relative flex flex-col w-40 bg-base-100 rounded-2xl border border-base-300 shadow-md"
                                            >
                                                <div className="badge badge-warning badge-sm font-bold absolute top-2 right-2 z-10 shadow-sm">
                                                    Lv. {challengeSelected?.EventList2[0].Level}
                                                </div>

                                                <div className="relative w-full h-20 bg-base-200 flex items-center justify-center p-4 rounded-t-2xl">
                                                    {mapMonster?.[waveValue.toString()]?.Image?.IconPath && (
                                                        <div className="relative w-16 h-16 rounded-full border-2 border-base-300 shadow-md overflow-hidden group-hover:scale-110 transition-transform duration-300 bg-base-100">
                                                            <Image
                                                                unoptimized
                                                                crossOrigin="anonymous"
                                                                src={`${process.env.CDN_URL}/${mapMonster?.[waveValue.toString()]?.Image?.IconPath}`}
                                                                alt="Enemy Icon"
                                                                width={150}
                                                                height={150}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col px-1 pb-2 pt-2">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <div className="flex justify-between items-center bg-base-200 px-2.5 py-1.5 rounded-lg">
                                                            <span className="text-xs font-semibold text-error">HP</span>
                                                            <span className="text-sm font-bold text-base-content">{monsterStats.hp.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        </div>

                                                        <div className="flex justify-between items-center bg-base-200 px-2.5 py-1.5 rounded-lg">
                                                            <span className="text-xs font-semibold text-info">Speed</span>
                                                            <span className="text-sm font-bold text-base-content">{monsterStats.spd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        </div>

                                                        <div className="flex justify-between items-center bg-base-200 px-2.5 py-1.5 rounded-lg">
                                                            <span className="text-xs font-semibold text-base-content/70">Toughness</span>
                                                            <span className="text-sm font-bold text-base-content">{monsterStats.stance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 pt-2 border-t border-base-300 flex flex-col items-center">
                                                        <span className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest mb-1.5">
                                                            Weakness
                                                        </span>
                                                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                            {mapMonster?.[waveValue.toString()]?.StanceWeakList?.map((icon, iconIndex) => (
                                                                <Image
                                                                    key={iconIndex}
                                                                    unoptimized
                                                                    crossOrigin="anonymous"
                                                                    src={`${process.env.CDN_URL}/${damageType[icon]?.Icon}`}
                                                                    alt={icon}
                                                                    width={40}
                                                                    height={40}
                                                                    className="h-6 w-6 object-contain rounded-full bg-base-300 border border-base-content/10 p-0.5 shadow-sm hover:scale-110 transition-transform"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}