import { getLocaleName, replaceByParam } from "@/helper";
import { AvatarStore, SkillDetail, SkillTreePoint } from "@/types";

export const SkillDescription = ({ skill, locale, avatarData, skillInfo }: {
    skill: SkillDetail,
    locale: string,
    avatarData: AvatarStore,
    skillInfo: SkillTreePoint
}) => {
    const levelKey = avatarData?.data.skills?.[skillInfo?.PointID]?.toString() || "";
    const params = skill.Level[levelKey]?.Param || [];
    const descHtml = getLocaleName(locale, skill.Desc) || getLocaleName(locale, skill.SimpleDesc);

    const extraList = Object.values(skill.Extra).length > 0
        ? Object.values(skill.Extra)
        : Object.values(skill?.SimpleExtra || {});

    return (
        <div className="flex flex-col gap-2">
            <div className="space-y-2 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary/80 rounded-sm" />
                    <div 
                        className="text-lg font-bold tracking-wide text-foreground uppercase" 
                        dangerouslySetInnerHTML={{ __html: replaceByParam(getLocaleName(locale, skill.Name), []) }} 
                    />
                </div>
                
                <div 
                    className="text-[15px] leading-relaxed text-foreground/90 pl-3 border-l border-transparent"
                    dangerouslySetInnerHTML={{ __html: replaceByParam(descHtml, params) }} 
                />
            </div>

            {extraList.map((extra) => (
                <div
                    key={extra.ID}
                    className="mt-3 pl-3 border-l-2 border-primary/30 bg-primary/5 py-2 rounded-r-sm"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold bg-primary/50 px-1.5 py-0.5 rounded">
                            Extra Effect
                        </span>
                        <span className="text-sm font-semibold text-primary/80">
                            {getLocaleName(locale, extra.Name)}
                        </span>
                    </div>

                    <div
                        className="text-sm leading-relaxed opacity-90"
                        dangerouslySetInnerHTML={{
                            __html: replaceByParam(getLocaleName(locale, extra.Desc), extra.Param)
                        }}
                    />
                </div>
            ))}
        </div>
    );
};