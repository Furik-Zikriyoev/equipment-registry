import { useEffect } from 'react'

const APP_NAME = 'Техпарк'

/** Заголовок вкладки: «Обзор парка — Техпарк» */
export function usePageTitle(title: string | undefined): void {
  useEffect(() => {
    document.title = title ? `${title} — ${APP_NAME}` : `${APP_NAME} — учёт строительной техники`
  }, [title])
}
