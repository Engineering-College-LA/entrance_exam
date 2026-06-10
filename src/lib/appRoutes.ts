import type { ExamType, PageId } from '../types/exam'

/** Shareable URL for Project Fest registration (no trailing slash). */
export const OPEN_DOORS_PATH = '/open_doors'

export const OPEN_DOORS_THANKS_PATH = '/open_doors/thanks'

export function normalizeBrowserPath(pathname: string): string {
  const t = pathname.trim()
  if (t.endsWith('/') && t.length > 1) return t.slice(0, -1)
  return t || '/'
}

export function resolveRoute(pathname: string): { page: PageId; examType: ExamType } {
  const p = normalizeBrowserPath(pathname)
  if (p === OPEN_DOORS_THANKS_PATH)
    return { page: 'openDoorThanks', examType: 'openDoor' }
  if (p === OPEN_DOORS_PATH) return { page: 'register', examType: 'openDoor' }
  if (p === '/mathematics') return { page: 'subject', examType: 'trial' }
  return { page: 'landing', examType: 'trial' }
}

export function pathForPage(page: PageId, examType: ExamType): string {
  if (page === 'openDoorThanks' && examType === 'openDoor') return OPEN_DOORS_THANKS_PATH
  if (page === 'register' && examType === 'openDoor') return OPEN_DOORS_PATH
  if (page === 'subject') return '/mathematics'
  return '/'
}
