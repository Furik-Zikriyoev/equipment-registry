// Текущий язык интерфейса: ?lang= в адресе → сохранённый выбор → русский.
// Хранится вне React, чтобы его читали и форматтеры, и мок-API.

export const LANGS = ['ru', 'en'] as const
export type Lang = (typeof LANGS)[number]

const STORAGE_KEY = 'tehpark-lang'

function isLang(value: unknown): value is Lang {
  return (LANGS as readonly unknown[]).includes(value)
}

function detect(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (isLang(fromUrl)) {
      localStorage.setItem(STORAGE_KEY, fromUrl)
      return fromUrl
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {
    // Хранилище недоступно — остаётся язык по умолчанию.
  }
  return 'ru'
}

let current: Lang = detect()
const listeners = new Set<() => void>()

if (typeof document !== 'undefined') document.documentElement.lang = current

export function getLang(): Lang {
  return current
}

export function setLang(lang: Lang): void {
  if (lang === current) return
  current = lang
  document.documentElement.lang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Не сохранится между визитами, но переключится сейчас.
  }
  listeners.forEach((listener) => listener())
}

export function subscribeLang(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Локаль для Intl: числа, даты. */
export function intlLocale(lang: Lang = current): string {
  return lang === 'ru' ? 'ru-RU' : 'en-GB'
}
