import { getResponse } from 'msw'
import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/**
 * Запасной вариант, если Service Worker недоступен (приватный режим, встроенные браузеры):
 * перехватываем fetch к /api и отвечаем теми же обработчиками MSW.
 */
export function installFetchFallback(): void {
  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input, init) => {
    const request = new Request(input, init)

    if (new URL(request.url).pathname.startsWith('/api/')) {
      const response = await getResponse(handlers, request)

      if (response) {
        return response
      }
    }

    return originalFetch(input, init)
  }
}
