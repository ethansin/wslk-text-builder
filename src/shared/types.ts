export type LanguageCode = 'en' | 'es' | 'zh-Hans' | 'zh-Hant'

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Spanish',
  'zh-Hans': 'Chinese (Simplified)',
  'zh-Hant': 'Chinese (Traditional)'
}

export type ElementType = 'date' | 'time' | 'plaintext' | 'day'

export interface TemplateElement {
  /** Matches a {{name}} placeholder in the template body. */
  name: string
  /** Plain-text question shown to the user on the fill-form screen. */
  prompt: string
  type: ElementType
}

export interface Template {
  /** Derived from the filename (without .md); stable key used for IPC lookups. */
  id: string
  name: string
  language: LanguageCode
  tags: string[]
  /** Body text containing {{elementName}} placeholders. */
  body: string
  elements: TemplateElement[]
}

export interface TemplateSummary {
  id: string
  name: string
  language: LanguageCode
  tags: string[]
}

export interface TagsFile {
  tags: string[]
}

export const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const

export type DayKey = (typeof DAY_KEYS)[number]

export type DayTranslations = Record<LanguageCode, Record<DayKey, string>>

/** Displayed labels for the day dropdown, always in English regardless of template language. */
export const DAY_LABELS_EN: Record<DayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

export interface LoadWarning {
  file: string
  message: string
}

export interface TemplatesListResult {
  templates: TemplateSummary[]
  warnings: LoadWarning[]
}

export interface SyncResult {
  status: 'updated' | 'error'
  message: string
}
