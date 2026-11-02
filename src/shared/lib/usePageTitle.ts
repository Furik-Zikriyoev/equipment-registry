import { useEffect } from 'react'

import { useT } from '../../i18n/useT'

/** Заголовок вкладки: «Обзор парка — Техпарк» / «Fleet overview — Techpark» */
export function usePageTitle(title: string | undefined): void {
  const t = useT()
  useEffect(() => {
    document.title = title ? `${title} — ${t.app.name}` : `${t.app.name} — ${t.app.tagline}`
  }, [title, t])
}
