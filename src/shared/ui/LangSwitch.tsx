import { SegmentedControl } from '@mantine/core'

import { LANGS, setLang, type Lang } from '../../i18n/lang'
import { useLang, useT } from '../../i18n/useT'

export function LangSwitch() {
  const t = useT()
  const lang = useLang()

  return (
    <SegmentedControl
      size="xs"
      radius="md"
      value={lang}
      onChange={(value) => setLang(value as Lang)}
      data={LANGS.map((value) => ({ value, label: value.toUpperCase() }))}
      aria-label={t.app.language}
      styles={{ label: { fontWeight: 700, paddingInline: 10 } }}
    />
  )
}
