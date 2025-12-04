'use client'
import { motion } from "framer-motion"
import { EyeOff, Eye, Hammer, RefreshCw, ShieldBan } from "lucide-react"
import useGlobalStore from '@/stores/globalStore';
import { useTranslations } from "next-intl";


export default function ExtraSettingBar() {
  const { extraData, setExtraData } = useGlobalStore()
  const transI18n = useTranslations("DataPage")

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theorycraft Mode */}
        {extraData?.theory_craft?.mode !== undefined && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="form-control bg-base-200 p-4 rounded-xl shadow"
          >
            <label className="flex flex-wrap items-center label cursor-pointer justify-start gap-3">
              <Hammer className="text-primary" size={20}/>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={extraData?.theory_craft?.mode}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    theory_craft: { ...extraData?.theory_craft, mode: e.target.checked }
                  })
                }
              />
              <span className="label-text font-semibold">{transI18n("theoryCraftMode")}</span>
            </label>
          </motion.div>
        )}

        {/* Cycle Count */}
        {extraData?.theory_craft?.mode && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="form-control bg-base-200 p-4 rounded-xl shadow"
          >
            <label className="flex flex-wrap items-center label justify-start gap-3">
              <RefreshCw className="text-info" size={20}/>
              <span className="label-text font-semibold">{transI18n("cycleCount")}</span>
              <input
                type="number"
                className="input input-bordered"
                value={extraData?.theory_craft?.cycle_count}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    theory_craft: {
                      ...extraData?.theory_craft,
                      cycle_count: parseInt(e.target.value) || 1
                    }
                  })
                }
                min="1"
              />
            </label>
          </motion.div>
        )}

        {/* Hidden UI */}
        {extraData?.setting?.hide_ui !== undefined && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="form-control bg-base-200 p-4 rounded-xl shadow"
          >
            <label className="flex flex-wrap items-center label cursor-pointer justify-start gap-3">
              {extraData?.setting?.hide_ui 
                ? <EyeOff className="text-warning" size={20}/>
                : <Eye className="text-success" size={20}/>
              }
              <input
                type="checkbox"
                className="toggle toggle-secondary"
                checked={extraData?.setting?.hide_ui}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    setting: { ...extraData?.setting, hide_ui: e.target.checked }
                  })
                }
              />
              <span className="label-text font-semibold">{transI18n("hideUI")}</span>
            </label>
          </motion.div>
        )}

        {/* Censorship */}
        {extraData?.setting?.censorship !== undefined && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="form-control bg-base-200 p-4 rounded-xl shadow"
          >
            <label className="flex flex-wrap items-center label cursor-pointer justify-start gap-3">
              <ShieldBan className="text-error" size={20}/>
              <input
                type="checkbox"
                className="toggle toggle-accent"
                checked={extraData?.setting?.censorship}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    setting: { ...extraData?.setting, censorship: e.target.checked }
                  })
                }
              />
              <span className="label-text font-semibold">{transI18n("disableCensorship")}</span>
            </label>
          </motion.div>
        )}
      </div>
    </div>
  );
}
