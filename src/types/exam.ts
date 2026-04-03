export type ExamQuestion = {
  topic: string
  topicKey?: string
  text: string
  textRu?: string
  opts: string[]
  optsRu?: string[]
  correct: number
}

export type RegistrationField = {
  key: string
  labelKey: string
  required?: boolean
  type: string
  placeholderKey?: string
  initialValue?: string
  options?: string[]
}

export type ExamResult = {
  correct: number
  total: number
  elapsed: number
  answers: Record<number, number>
}

export type PageId = 'landing' | 'register' | 'intro' | 'exam' | 'report'

export type ExamType = 'trial' | 'placement'
