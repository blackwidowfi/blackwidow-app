import type { BackendModule, ReadCallback } from "i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { env } from "#/env";

export const i18nConfig = {
  defaultLocale: "en",
  defaultNamespace: "common",
} as const;

class LazyImportBackend<TOptions> implements BackendModule<TOptions> {
  static type = "backend" as const;
  type = "backend" as const;

  init(): void {
    // NOOP
  }

  read: BackendModule<TOptions>["read"] = async function (
    language: string,
    namespace: string,
    callback: ReadCallback,
  ): Promise<void> {
    try {
      const module = (await import(`./locales/${language}/${namespace}.ts`)) as unknown as Record<
        "default",
        unknown
      >;
      callback(null, module.default ?? module);
    } catch (error) {
      callback(error as Error, false);
    }
  };
}

void i18next
  .use(LazyImportBackend)
  .use(initReactI18next)
  .init({
    lng: i18nConfig.defaultLocale,
    fallbackLng: i18nConfig.defaultLocale,
    defaultNS: i18nConfig.defaultNamespace,
    debug: env.DEV && env.MODE !== "test",
    lowerCaseLng: true,
    ns: [],
    load: "currentOnly",
    interpolation: {
      escapeValue: false,
    },
    react: {
      transKeepBasicHtmlNodesFor: ["b", "br", "strong", "i"],
    },
  });

export default i18next;
