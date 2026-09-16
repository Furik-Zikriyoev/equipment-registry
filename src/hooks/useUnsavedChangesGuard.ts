import { useCallback, useEffect, useRef } from 'react'
import { useBlocker } from 'react-router-dom'

interface UnsavedChangesGuard {
  isBlocked: boolean
  confirmLeave: () => void
  cancelLeave: () => void
  allowNavigation: () => void
}

export function useUnsavedChangesGuard(isEnabled: boolean): UnsavedChangesGuard {
  const isEnabledRef = useRef(isEnabled)
  const isAllowedRef = useRef(false)

  useEffect(() => {
    isEnabledRef.current = isEnabled
  }, [isEnabled])

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEnabledRef.current &&
      !isAllowedRef.current &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    function handleBeforeUnload(event: BeforeUnloadEvent): void {
      if (isAllowedRef.current) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isEnabled])

  const confirmLeave = useCallback(() => {
    blocker.proceed?.()
  }, [blocker])

  const cancelLeave = useCallback(() => {
    blocker.reset?.()
  }, [blocker])

  const allowNavigation = useCallback(() => {
    isAllowedRef.current = true
  }, [])

  return {
    isBlocked: blocker.state === 'blocked',
    confirmLeave,
    cancelLeave,
    allowNavigation,
  }
}
