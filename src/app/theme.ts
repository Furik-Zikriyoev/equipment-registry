import { createTheme, type MantineColorsTuple } from '@mantine/core'

// Фирменный жёлтый — цвет строительной техники
const brand: MantineColorsTuple = [
  '#fff8e1',
  '#ffefcb',
  '#ffdd9a',
  '#ffca64',
  '#ffba38',
  '#ffb01b',
  '#ffab09',
  '#e39500',
  '#ca8400',
  '#af7100',
]

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 5 },
  colors: { brand },
  autoContrast: true,
  luminanceThreshold: 0.45,
  fontFamily: 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  headings: {
    fontFamily: 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
})
