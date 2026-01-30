import { listCurrentLanguage } from "@/constant/constant";
import { CharacterBasic, EventBasic, LightConeBasic, MonsterBasic } from "@/types";
import { useTranslations } from "next-intl"

type TFunc = ReturnType<typeof useTranslations>

export function getNameChar(locale: string, t: TFunc, data: CharacterBasic | undefined): string {
    if (!data) {
        return ""
    }
    if (!listCurrentLanguage.hasOwnProperty(locale)) {
        return ""
    }

    let text = data.lang.get(listCurrentLanguage[locale as keyof typeof listCurrentLanguage].toLowerCase()) ?? "";
    if (!text) {
        text = data.lang.get("en") ?? "";
    }
    if (Number(data.id) > 8000) {
        text = `${t("trailblazer")} • ${t(data?.baseType?.toLowerCase() ?? "")}`;
    }
    return text
}

export function getLocaleName(locale: string, data: LightConeBasic | EventBasic | MonsterBasic | undefined): string {
    if (!data) {
        return ""
    }
    if (!listCurrentLanguage.hasOwnProperty(locale)) {
        return ""
    }

    let text = data.lang.get(listCurrentLanguage[locale as keyof typeof listCurrentLanguage].toLowerCase()) ?? "";
    if (!text) {
        text = data.lang.get("en") ?? "";
    }
    return text
}

export function parseRuby(text: string): string {
    const rubyRegex = /\{RUBY_B#(.*?)\}(.*?)\{RUBY_E#\}/gs;
    return text.replace(rubyRegex, (_match, furigana, kanji) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
}