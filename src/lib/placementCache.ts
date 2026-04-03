import type { ExamResult } from '../types/exam'

const PHONES_KEY = 'ec_placement_phones'
const CACHE_KEY = 'ec_placement_results_cache'
const LAST_REGISTERED_PHONE_KEY = 'ec_last_registered_phone'

export function normalizePhone(p: string): string {
  return (p || '').trim()
}

export function getPlacementCompletedPhones(): string[] {
  try {
    const raw = localStorage.getItem(PHONES_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as unknown
    return Array.isArray(arr)
      ? arr.filter((x): x is string => typeof x === 'string')
      : []
  } catch {
    return []
  }
}

export function hasPhoneCompletedPlacement(phone: string): boolean {
  const p = normalizePhone(phone)
  if (!/^\+996\d{9}$/.test(p)) return false
  return getPlacementCompletedPhones().includes(p)
}

/** Call after any registration submit (trial or placement) so landing can reflect “last” student. */
export function setLastRegisteredPhone(phone: string): void {
  const p = normalizePhone(phone)
  if (p) localStorage.setItem(LAST_REGISTERED_PHONE_KEY, p)
}

export function getLastRegisteredPhone(): string {
  return localStorage.getItem(LAST_REGISTERED_PHONE_KEY) ?? ''
}

/** Cleared when user taps “Start Placement” so the landing card is not stuck for the next student. */
export function clearLastRegisteredPhone(): void {
  localStorage.removeItem(LAST_REGISTERED_PHONE_KEY)
}

/** True when the last registered phone on this device has already finished the placement test. */
export function shouldDisablePlacementStart(): boolean {
  const last = getLastRegisteredPhone()
  return last !== '' && hasPhoneCompletedPlacement(last)
}

/** After placement exam is finished — persist phone list + optional results cache. */
export function recordPlacementCompletion(
  student: Record<string, string>,
  result: ExamResult,
): void {
  const phone = normalizePhone(student.phone ?? '')
  if (!/^\+996\d{9}$/.test(phone)) return

  const phones = getPlacementCompletedPhones()
  if (!phones.includes(phone)) phones.push(phone)
  localStorage.setItem(PHONES_KEY, JSON.stringify(phones))

  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const cache = (raw ? JSON.parse(raw) : []) as unknown[]
    const list = Array.isArray(cache) ? cache : []
    const pct = Math.round((result.correct / result.total) * 100)
    list.push({
      phone,
      firstName: student.firstName,
      lastName: student.lastName,
      score: pct,
      correct: result.correct,
      total: result.total,
      elapsed: result.elapsed,
      completedAt: new Date().toISOString(),
    })
    localStorage.setItem(CACHE_KEY, JSON.stringify(list.slice(-100)))
  } catch {
    /* ignore */
  }
}
