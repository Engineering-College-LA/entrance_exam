import type { ExamType, PageId } from '../types/exam'

/** Shareable URL for Project Fest registration (no trailing slash). */
export const OPEN_DOORS_PATH = '/open_doors'

export const OPEN_DOORS_THANKS_PATH = '/open_doors/thanks'

/** Finik RedirectUrl target after the hosted payment page. */
export const PAYMENT_RESULT_PATH = '/payment/result'

/** Shareable URL for the Math Olympiad (9th grade) registration. */
export const OLYMPIAD_PATH = '/olympiad'

export const OLYMPIAD_THANKS_PATH = '/olympiad/thanks'

export function normalizeBrowserPath(pathname: string): string {
  const t = pathname.trim()
  if (t.endsWith('/') && t.length > 1) return t.slice(0, -1)
  return t || '/'
}

export function resolveRoute(pathname: string): { page: PageId; examType: ExamType; subject?: string } {
  const p = normalizeBrowserPath(pathname)
  if (p === OPEN_DOORS_THANKS_PATH)
    return { page: 'openDoorThanks', examType: 'openDoor' }
  if (p === OPEN_DOORS_PATH) return { page: 'register', examType: 'openDoor' }
  if (p === PAYMENT_RESULT_PATH) return { page: 'paymentResult', examType: '' }
  if (p === OLYMPIAD_THANKS_PATH) return { page: 'olympiadThanks', examType: 'olympiad' }
  if (p === OLYMPIAD_PATH) return { page: 'register', examType: 'olympiad' }
  if (p === '/mathematics' || p === '/subject/math') return { page: 'subject', examType: 'trial', subject: 'math' }
  if (p.startsWith('/subject/')) {
    const s = decodeURIComponent(p.split('/')[2])
    return { page: 'subject', examType: 'trial', subject: s }
  }
  return { page: 'landing', examType: 'trial' }
}

export function pathForPage(page: PageId, examType: ExamType, eventId?: string | null, subject?: string | null): string {
  if (page === 'openDoorThanks' && examType === 'openDoor') return OPEN_DOORS_THANKS_PATH
  if (page === 'register' && examType === 'openDoor') {
    return eventId ? `${OPEN_DOORS_PATH}?event=${encodeURIComponent(eventId)}` : OPEN_DOORS_PATH
  }
  if (page === 'subject') {
    if (subject === 'math') return '/mathematics'
    return subject ? `/subject/${encodeURIComponent(subject)}` : '/mathematics'
  }
  if (page === 'paymentResult') return PAYMENT_RESULT_PATH
  if (page === 'olympiadThanks' && examType === 'olympiad') return OLYMPIAD_THANKS_PATH
  if (page === 'register' && examType === 'olympiad') return OLYMPIAD_PATH
  return '/'
}
