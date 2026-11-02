import { useEffect, useRef, type ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useLang } from '../i18n/useT'
import { theme } from './theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

/** Мок-API отвечает на текущем языке: после смены языка перезапрашиваем данные. */
function RefetchOnLanguageChange() {
  const lang = useLang()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    void queryClient.invalidateQueries()
  }, [lang])
  return null
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <RefetchOnLanguageChange />
        {children}
      </QueryClientProvider>
    </MantineProvider>
  )
}
