'use client'
import { motion } from "framer-motion"
import { EyeOff, Eye, Hammer, RefreshCw, ShieldBan, User, Swords, SkipForward, BowArrow, Info, RouteIcon, Search } from "lucide-react"
import useGlobalStore from '@/stores/globalStore'
import { useTranslations } from "next-intl"
import useEventStore from "@/stores/eventStore"
import { getLocaleName, getNameChar } from "@/helper"
import useLocaleStore from "@/stores/localeStore"
import useAvatarStore from "@/stores/avatarStore"
import SelectCustomImage from "../select/customSelectImage"
import { useMemo, useState } from "react"
import useMazeStore from "@/stores/mazeStore"

export default function ExtraSettingBar() {
  const { extraData, setExtraData } = useGlobalStore()
  const transI18n = useTranslations("DataPage")
  const { PEAKEvent } = useEventStore()
  const { listAvatar } = useAvatarStore()
  const { locale } = useLocaleStore()
  const [showSearchStage, setShowSearchStage] = useState(false)
  const [isChildClick, setIsChildClick] = useState(false)
  const [stageSearchTerm, setStageSearchTerm] = useState("")
  const [stagePage, setStagePage] = useState(1)
  const { Stage } = useMazeStore()
  const pageSize = 30
  const stageList = useMemo(() => Object.values(Stage).map((stage) => ({
    id: stage.stage_id.toString(),
    name: `${stage.stage_type} (${stage.stage_id})`,
  })), [Stage])

  const filteredStages = useMemo(() => stageList.filter((s) =>
    s.name.toLowerCase().includes(stageSearchTerm.toLowerCase())
  ), [stageList, stageSearchTerm])

  const paginatedStages = useMemo(() => filteredStages.slice(
    (stagePage - 1) * pageSize,
    stagePage * pageSize
  ), [filteredStages, stagePage, pageSize])

  const hasMorePages = useMemo(() => stagePage * pageSize < filteredStages.length, [stagePage, filteredStages])

  const onChangeSearch = (v: string) => {
    setStageSearchTerm(v)
    setStagePage(1)
  }

  return (
    <div className="px-4 sm:px-6 py-4 space-y-8">
      {extraData?.theory_craft && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {transI18n("theoryCraft")}
            <div className="tooltip tooltip-info tooltip-bottom" data-tip={transI18n("detailTheoryCraft")}>
              <Info className="text-primary" size={20} />
            </div>
          </h3>

          <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
            <label className="flex flex-wrap items-center cursor-pointer justify-start gap-3">
              <Hammer className="text-primary" size={20} />
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={extraData?.theory_craft?.mode}
                onChange={(e) => {
                  setExtraData({
                    ...extraData,
                    theory_craft: {
                      hp: extraData?.theory_craft?.hp || {},
                      cycle_count: extraData?.theory_craft?.cycle_count || 1,
                      mode: e.target.checked,
                      stage_id: extraData?.theory_craft?.stage_id || 0
                    }
                  })
                }

                }
              />
              <span className="label-text font-semibold">{transI18n("theoryCraftMode")}</span>
            </label>
          </motion.div>

          {extraData?.theory_craft?.mode && (
            <>
              <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
                <label className="flex flex-wrap items-center justify-start gap-3">
                  <RefreshCw className="text-info" size={20} />
                  <span className="label-text font-semibold">{transI18n("cycleCount")}</span>
                  <input
                    type="number"
                    className="input input-primary"
                    value={extraData?.theory_craft?.cycle_count}
                    onChange={(e) =>
                      setExtraData({
                        ...extraData,
                        theory_craft: {
                          hp: extraData?.theory_craft?.hp || {},
                          cycle_count: Number(e.target.value) || 1,
                          mode: extraData?.theory_craft?.mode || false,
                          stage_id: extraData?.theory_craft?.stage_id || 0
                        }
                      })
                    }
                    min="1"
                  />
                </label>
              </motion.div>
              <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
                <label className="flex flex-wrap items-center justify-start gap-3">
                  <RouteIcon className="text-info" size={20} />
                  <span className="label-text font-semibold">{transI18n("stage")}</span>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="btn btn-outline w-full text-left flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isChildClick) {
                            setShowSearchStage(pre => !pre)
                          }
                          setIsChildClick(false)
                        }}
                      >
                        <Search className="w-6 h-6" />
                        <span className="text-left"> {transI18n("stage")}: {stageList.find((s) => s.id === extraData?.theory_craft?.stage_id?.toString())?.name || transI18n("selectStage")}</span>
                      </button>
                    </div>
                    {showSearchStage && (
                      <div onClick={(e) => e.stopPropagation()} className="absolute top-full mt-2 w-full z-50 border bg-base-200 border-slate-600 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">

                          <label className="input w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                              >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                              </g>
                            </svg>
                            <input
                              type="search" className="grow"
                              placeholder={transI18n("searchStage")}
                              value={stageSearchTerm}
                              onChange={(e) => onChangeSearch(e.target.value)}
                              autoFocus
                            />

                          </label>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-1">
                          {paginatedStages.length > 0 ? (
                            <>
                              {paginatedStages.map((stage) => (
                                <div
                                  key={stage.id}
                                  className="p-2 hover:bg-primary/20 rounded cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setIsChildClick(true)
    
                                    if (extraData?.theory_craft?.stage_id !== Number(stage.id)) {
                                      setExtraData({
                                        ...extraData,
                                        theory_craft: {
                                          stage_id: Number(stage.id),
                                          cycle_count: extraData?.theory_craft?.cycle_count || 1,
                                          mode: extraData?.theory_craft?.mode || false,
                                          hp: extraData?.theory_craft?.hp || {}
                                        }
                                      })
                                    }
                                    setShowSearchStage(pre => !pre)
                                    onChangeSearch("")
                                  }}
                                >
                                  {stage.name}
                                </div>
                              ))}


                            </>
                          ) : (
                            <div className="text-sm text-center py-4">{transI18n("noStageFound")}</div>
                          )}
                        </div>
                        {paginatedStages.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <button
                              disabled={stagePage === 1}
                              className="btn btn-sm btn-outline btn-success mt-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                setStagePage(stagePage - 1)
                              }}
                            >
                              {transI18n("previous")}
                            </button>

                            <button
                              disabled={!hasMorePages}
                              className="btn btn-sm btn-outline btn-success mt-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                setStagePage(stagePage + 1)
                              }}
                            >
                              {transI18n("next")}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </motion.div>
            </>
          )}
        </div>
      )}

      {/*MULTIPATH CHAR */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {transI18n("multipathCharacter")}
          <div className="tooltip tooltip-info tooltip-bottom" data-tip={transI18n("detailMultipathCharacter")}>
            <Info className="text-primary" size={20} />
          </div>
        </h3>

        <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
          <label className="flex items-center gap-3">
            <User className="text-warning" size={20} />
            <span className="label-text font-semibold">{transI18n("mainPath")}</span>
            <SelectCustomImage
              customSet={listAvatar.filter((it) => extraData?.multi_path?.multi_path_main?.includes(Number(it.id))).map((it) => ({
                value: it.id,
                label: getNameChar(locale, transI18n, it),
                imageUrl: `/icon/${it.baseType.toLowerCase()}.webp`
              }))}
              excludeSet={[]}
              selectedCustomSet={extraData?.multi_path?.main?.toString() || ""}
              placeholder={transI18n("selectAMainStat")}
              setSelectedCustomSet={(it) => {
                if (!it) return
                setExtraData({
                  ...extraData,
                  multi_path: {
                    march_7: extraData?.multi_path?.march_7 || 1001,
                    main: Number(it) || 8001,
                    multi_path_main: extraData?.multi_path?.multi_path_main || [],
                    multi_path_march_7: extraData?.multi_path?.multi_path_march_7 || []
                  }
                })
              }}
            />

          </label>
        </motion.div>

        <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
          <label className="flex items-center gap-3">
            <BowArrow className="text-info" size={20} />
            <span className="label-text font-semibold">{transI18n("march7Path")}</span>
            <SelectCustomImage
              customSet={listAvatar.filter((it) => extraData?.multi_path?.multi_path_march_7?.includes(Number(it.id))).map((it) => ({
                value: it.id,
                label: getNameChar(locale, transI18n, it),
                imageUrl: `/icon/${it.baseType.toLowerCase()}.webp`
              }))}
              excludeSet={[]}
              selectedCustomSet={extraData?.multi_path?.march_7?.toString() || ""}
              placeholder={transI18n("selectAMainStat")}
              setSelectedCustomSet={(it) => {
                if (!it) return
                setExtraData({
                  ...extraData,
                  multi_path: {
                    march_7: Number(it) || 1001,
                    main: extraData?.multi_path?.main || 8001,
                    multi_path_main: extraData?.multi_path?.multi_path_main || [],
                    multi_path_march_7: extraData?.multi_path?.multi_path_march_7 || []
                  }
                })
              }}
            />
          </label>
        </motion.div>
      </div>

      {/* CHALLENGE */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">{transI18n("challenge")}</h3>

        <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
          <label className="flex items-center gap-3">
            <Swords className="text-error" size={20} />
            <span className="label-text font-semibold">{transI18n("anomalyArbitration")}</span>
            <div className="tooltip tooltip-info tooltip-bottom" data-tip={transI18n("detailChallengePeak")}>
              <Info className="text-primary" size={20} />
            </div>
            <select
              value={extraData?.challenge?.challenge_peak_group_id || ""}
              className="select select-error"
              onChange={(e) =>
                setExtraData({
                  ...extraData,
                  challenge: {
                    skip_node: extraData?.challenge?.skip_node || 0,
                    challenge_peak_group_id: parseInt(e.target.value) || 0,
                    challenge_peak_group_id_list: extraData?.challenge?.challenge_peak_group_id_list || []
                  }
                })
              }
            >
              {PEAKEvent.filter(event => extraData?.challenge?.challenge_peak_group_id_list?.includes(Number(event.id))).map(event => (
                <option key={event.id} value={event.id}>
                  {getLocaleName(locale, event)} ({event.id})
                </option>
              ))}
            </select>
          </label>
        </motion.div>

        <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
          <label className="flex items-center gap-3">
            <SkipForward className="text-warning" size={20} />
            <span className="label-text font-semibold">{transI18n("skipNode")}</span>
            <div className="tooltip tooltip-info tooltip-bottom" data-tip={transI18n("detailSkipNode")}>
              <Info className="text-primary" size={20} />
            </div>
            <select
              value={extraData?.challenge?.skip_node || "0"}
              className="select select-warning"
              onChange={(e) =>
                setExtraData({
                  ...extraData,
                  challenge: {
                    challenge_peak_group_id: extraData?.challenge?.challenge_peak_group_id || 0,
                    challenge_peak_group_id_list: extraData?.challenge?.challenge_peak_group_id_list || [],
                    skip_node: parseInt(e.target.value) || 0
                  }
                })
              }
            >
              <option value="0">{transI18n("disableSkip")}</option>
              <option value="1">{transI18n("skipNode1")}</option>
              <option value="2">{transI18n("skipNode2")}</option>
            </select>
          </label>
        </motion.div>
      </div>

      {/*EXTRA FEATURES */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">{transI18n("extraFeatures")}</h3>

        {extraData?.setting?.hide_ui !== undefined && (
          <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
            <label className="flex flex-wrap items-center cursor-pointer justify-start gap-3">
              {extraData?.setting?.hide_ui
                ? <EyeOff className="text-warning" size={20} />
                : <Eye className="text-success" size={20} />
              }

              <input
                type="checkbox"
                className="toggle toggle-secondary"
                checked={extraData?.setting?.hide_ui}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    setting: {
                      hide_ui: e.target.checked,
                      censorship: extraData?.setting?.censorship || false,
                      cm: extraData?.setting?.cm || false,
                      first_person: extraData?.setting?.first_person || false
                    }
                  })
                }
              />
              <span className="label-text font-semibold">{transI18n("hideUI")}</span>
              <div className="tooltip tooltip-info tooltip-bottom" data-tip={transI18n("detailHiddenUi")}>
                <Info className="text-primary" size={20} />
              </div>
            </label>
          </motion.div>
        )}

        {extraData?.setting?.censorship !== undefined && (
          <motion.div className="form-control bg-base-200 p-4 rounded-xl shadow">
            <label className="flex flex-wrap items-center cursor-pointer justify-start gap-3">
              <ShieldBan className="text-error" size={20} />
              <input
                type="checkbox"
                className="toggle toggle-accent"
                checked={extraData?.setting?.censorship}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    setting: {
                      censorship: e.target.checked,
                      hide_ui: extraData?.setting?.hide_ui || false,
                      cm: extraData?.setting?.cm || false,
                      first_person: extraData?.setting?.first_person || false
                    }
                  })
                }
              />
              <span className="label-text font-semibold">{transI18n("disableCensorship")}</span>
              <div className="tooltip tooltip-info tooltip-bottom" data-tip={transI18n("detailDisableCensorship")}>
                <Info className="text-primary" size={20} />
              </div>
            </label>
          </motion.div>
        )}
      </div>

    </div>
  )
}
