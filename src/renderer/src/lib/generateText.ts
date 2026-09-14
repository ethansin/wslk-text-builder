import type { Template, DayTranslations, DayKey } from '@shared/types'

/** Placeholder syntax: {{elementName}}, tolerating optional inner whitespace. */
const PLACEHOLDER_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g

/**
 * Fills a template's body from the user's answers. `day` elements store a canonical
 * lowercase key (e.g. "monday") and are translated into the template's language via
 * dayTranslations, falling back to English and finally the raw key if a language or
 * entry is missing — so an incomplete day-translations.json degrades gracefully
 * instead of throwing.
 */
export function generateText(
  template: Template,
  answers: Record<string, string>,
  dayTranslations: DayTranslations
): string {
  return template.body.replace(PLACEHOLDER_RE, (_match, name: string) => {
    const element = template.elements.find((e) => e.name === name)
    const rawValue = answers[name] ?? ''

    if (element?.type === 'day') {
      const dayKey = rawValue.toLowerCase() as DayKey
      const table = dayTranslations[template.language] ?? dayTranslations.en
      return table?.[dayKey] ?? rawValue
    }

    return rawValue
  })
}
