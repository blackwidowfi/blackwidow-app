import type { i18nConfig } from "./config";
import type en from "./locales/en";

type Messages = typeof en;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof i18nConfig.defaultNamespace;
    resources: Messages;
  }
}
