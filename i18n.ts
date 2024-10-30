import {getRequestConfig} from "next-intl/server";
import {i18n} from "@/app.config";


export default getRequestConfig(async () => {
    const locale = i18n.defaultLocale;
    return {
        locale,
        messages: (await import(`./src/messages/${locale}.json`)).default,
    };
});




