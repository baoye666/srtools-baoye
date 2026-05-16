import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const supportedLocales = new Set([
    "en",
    "vi",
    "ja",
    "ko",
    "zh",
    "de",
    "es",
    "fr",
    "id",
    "pt",
    "ru",
    "th",
]);

export default getRequestConfig( async () => {
    const cookieLocale = (await cookies()).get("MYNEXTAPP_LOCALE")?.value;
    const locale = cookieLocale && supportedLocales.has(cookieLocale) ? cookieLocale : "en";

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    }
})
