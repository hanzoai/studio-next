/**
 * i18n setup - uses i18next for cross-platform string localization.
 *
 * Locale JSON files are reused from studio-frontend/src/locales/.
 * They're loaded lazily per-locale at runtime.
 */
import i18next from 'i18next'

export const SUPPORTED_LOCALES = [
  'en',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
  'fr',
  'de',
  'ru',
  'es',
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  es: 'Español',
}

let initialized = false

/**
 * Initialize i18next. Call once at app startup.
 * @param locale - Initial locale
 * @param loadTranslations - Platform-specific function to load a locale's JSON
 */
export async function initI18n(
  locale: SupportedLocale,
  loadTranslations: (locale: SupportedLocale) => Promise<Record<string, string>>
): Promise<typeof i18next> {
  if (initialized) return i18next

  const resources = await loadTranslations(locale)

  await i18next.init({
    lng: locale,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      [locale]: { translation: resources },
    },
  })

  initialized = true
  return i18next
}

export async function changeLocale(
  locale: SupportedLocale,
  loadTranslations: (locale: SupportedLocale) => Promise<Record<string, string>>
): Promise<void> {
  if (!i18next.hasResourceBundle(locale, 'translation')) {
    const resources = await loadTranslations(locale)
    i18next.addResourceBundle(locale, 'translation', resources)
  }
  await i18next.changeLanguage(locale)
}

export { i18next }
