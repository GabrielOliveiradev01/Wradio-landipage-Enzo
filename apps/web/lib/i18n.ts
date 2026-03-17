import ptBR, { PtBrDictionary } from "@/locales/pt-br";

const dictionaries = {
  "pt-br": ptBR,
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = PtBrDictionary;

export const getDictionary = (locale: Locale = "pt-br") => dictionaries[locale];
export const ptBr = dictionaries["pt-br"];
