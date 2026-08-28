import { z } from 'zod'
import { DAY_KEYS } from './types'

export const LanguageCodeSchema = z.enum(['en', 'es', 'zh-Hans', 'zh-Hant'])

export const ElementTypeSchema = z.enum(['date', 'time', 'plaintext', 'day'])

export const TemplateElementSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(1),
  type: ElementTypeSchema
})

/** Matches a template file's on-disk shape (no `id` — that's derived from the filename). */
export const TemplateFileSchema = z.object({
  name: z.string().min(1),
  language: LanguageCodeSchema,
  tags: z.array(z.string()),
  body: z.string().min(1),
  elements: z.array(TemplateElementSchema)
})

export const TagsFileSchema = z.object({
  tags: z.array(z.string())
})

const DayKeySchema = z.enum(DAY_KEYS)
const DayTranslationTableSchema = z.record(DayKeySchema, z.string())

export const DayTranslationsSchema = z.record(LanguageCodeSchema, DayTranslationTableSchema)
