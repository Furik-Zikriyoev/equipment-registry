import { useSyncExternalStore } from 'react'

import { getLang, subscribeLang, type Lang } from './lang'
import { MESSAGES, type Messages } from './messages'

export function useLang(): Lang {
  return useSyncExternalStore(subscribeLang, getLang, getLang)
}

/** Тексты на текущем языке; компонент перерисуется при смене языка. */
export function useT(): Messages {
  return MESSAGES[useLang()]
}

/** Для кода вне React (мок-API, форматтеры). */
export function messages(): Messages {
  return MESSAGES[getLang()]
}
