'use client'
import { motion } from "framer-motion"
import { EyeOff, Eye, Hammer, RefreshCw, ShieldBan, User, Swords, SkipForward, BowArrow, Info } from "lucide-react"
import useGlobalStore from '@/stores/globalStore'
import { useTranslations } from "next-intl"
import useEventStore from "@/stores/eventStore"
import { getLocaleName, getNameChar } from "@/helper"
import useLocaleStore from "@/stores/localeStore"
import useAvatarStore from "@/stores/avatarStore"
import SelectCustomImage from "../select/customSelectImage"

export default function ExtraSettingBar() {
  const { extraData, setExtraData } = useGlobalStore()
  const transI18n = useTranslations("DataPage")
  const { PEAKEvent } = useEventStore()
  const { listAvatar } = useAvatarStore()
  const { locale } = useLocaleStore()

  return (
    <div className="px-4 sm:px-6 py-4 space-y-8">
      {extraData?.theory_craft && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {transI18n("theoryCraft")} 
            <div className="tooltip tooltip-info" data-tip={transI18n("detailTheoryCraft")}>
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
                      cycle_count: extraData?.theory_craft?.cycle_count || 0,
                      mode: e.target.checked
                    }
                  })
                }

                }
              />
              <span className="label-text font-semibold">{transI18n("theoryCraftMode")}</span>
            </label>
          </motion.div>

          {extraData?.theory_craft?.mode && (
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
                        cycle_count: parseInt(e.target.value) || 1,
                        mode: extraData?.theory_craft?.mode || false
                      }
                    })
                  }
                  min="1"
                />
              </label>
            </motion.div>
          )}
        </div>
      )}



      {/*MULTIPATH CHAR */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {transI18n("multipathCharacter")}
          <div className="tooltip tooltip-info" data-tip={transI18n("detailMultipathCharacter")}>
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
                label: getNameChar(locale, it),
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
                label: getNameChar(locale, it),
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
            <div className="tooltip tooltip-info" data-tip={transI18n("detailChallengePeak")}>
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
            <div className="tooltip tooltip-info" data-tip={transI18n("detailSkipNode")}>
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
              <div className="tooltip tooltip-info" data-tip={transI18n("detailHiddenUi")}>
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
              <div className="tooltip tooltip-info" data-tip={transI18n("detailDisableCensorship")}>
                <Info className="text-primary" size={20} />
              </div>
            </label>
          </motion.div>
        )}
      </div>



    </div>
  )
}
