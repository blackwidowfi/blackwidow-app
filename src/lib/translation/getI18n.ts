import type { FlatNamespace, i18n, KeyPrefix, TFunction } from "i18next";
import type { FallbackNs, UseTranslationResponse } from "react-i18next";
import { getI18n as getDefaultI18n } from "react-i18next";

import { i18nConfig } from "./config";
import type en from "./locales/en";

type Namespaces = keyof typeof en;

type Tuple<T> = readonly [T, ...T[]];

type Literal<T> = T extends string ? (string extends T ? never : T) : never;

type LiteralWithColon<T> = T extends `${string}:${string}` ? Literal<T> : never;

type TKey<NS extends Namespaces> = `${NS}:${Literal<Parameters<TFunction<NS, undefined>>[0]>}`;

export type TranslationKey<NS extends Namespaces | readonly Namespaces[]> =
  NS extends readonly Namespaces[]
    ? LiteralWithColon<Parameters<TFunction<NS, undefined>>[0]>
    : NS extends Namespaces
      ? TKey<NS>
      : never;

export type Translate = i18n["t"];

export const getI18n = async <
  const TNs extends FlatNamespace | Tuple<FlatNamespace> | undefined = undefined,
  const TKPrefix extends KeyPrefix<FallbackNs<TNs>> = undefined,
>(
  namespaces?: TNs,
): Promise<UseTranslationResponse<FallbackNs<TNs>, TKPrefix>> => {
  const namespacesToLoad = (Array.isArray(namespaces)
    ? namespaces
    : [namespaces ?? i18nConfig.defaultNamespace]) as unknown as readonly string[];

  const i18n = getDefaultI18n();

  if (!i18n.hasLoadedNamespace(namespacesToLoad)) {
    await i18n.loadNamespaces(namespacesToLoad);
  }

  return i18n as unknown as UseTranslationResponse<FallbackNs<TNs>, TKPrefix>;
};
