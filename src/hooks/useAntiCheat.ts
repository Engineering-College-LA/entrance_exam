import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'tabSwitchCount'
const DUPLICATE_EVENT_WINDOW_MS = 300

export const useAntiCheat = (
  onViolation: () => void,
  onWarning?: (count: number) => void,
) => {
  const violationCountRef = useRef<number>(0)
  const onViolationRef = useRef(onViolation)
  const onWarningRef = useRef(onWarning)
  const eventTimestampRef = useRef<number>(0)
  const hasTriggeredViolationRef = useRef<boolean>(false)
  const fullscreenEnteredRef = useRef<boolean>(false)

  useEffect(() => {
    onViolationRef.current = onViolation
    onWarningRef.current = onWarning
  }, [onViolation, onWarning])

  useEffect(() => {
    violationCountRef.current = 0
    localStorage.setItem(STORAGE_KEY, '0')

    const shouldCount = () => {
      const now = Date.now()
      if (now - eventTimestampRef.current < DUPLICATE_EVENT_WINDOW_MS) {
        return false
      }
      eventTimestampRef.current = now
      return true
    }

    const recordViolation = () => {
      if (!shouldCount() || hasTriggeredViolationRef.current) return

      violationCountRef.current += 1
      localStorage.setItem(STORAGE_KEY, violationCountRef.current.toString())

      if (violationCountRef.current === 1 || violationCountRef.current === 2) {
        console.warn(
          `Античит: нарушение ${violationCountRef.current}. Следующее нарушение завершит экзамен.`,
        )
        onWarningRef.current?.(violationCountRef.current)
      }

      if (violationCountRef.current >= 3) {
        hasTriggeredViolationRef.current = true
        onViolationRef.current()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation()
      }
    }

    const handleWindowBlur = () => {
      recordViolation()
    }

    const handleWindowFocus = () => {
      if (violationCountRef.current > 0 && violationCountRef.current < 3) {
        onWarningRef.current?.(violationCountRef.current)
      }
    }

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        fullscreenEnteredRef.current = true
        return
      }

      if (fullscreenEnteredRef.current) {
        recordViolation()
      }
    }

    const requestFullscreen = async () => {
      if (!document.documentElement.requestFullscreen) return
      try {
        await document.documentElement.requestFullscreen()
        fullscreenEnteredRef.current = true
      } catch {
        // пользователь мог запретить fullscreen, в таком случае продолжаем без ошибки
      }
    }

    requestFullscreen()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)

      if (document.fullscreenElement && document.exitFullscreen) {
        void document.exitFullscreen()
      }
    }
  }, [])
}
