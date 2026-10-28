import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, type Locale } from "./i18n";

/** Reads the locale cookie on the server so the first paint is already correct. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "en";
}
