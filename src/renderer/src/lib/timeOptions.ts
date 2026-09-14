/** Granularity of the minute dropdown. Change this single constant to regenerate its options. */
export const TIME_STEP_MINUTES = 15

export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1)) // "1".."12"

export const PERIOD_OPTIONS = ['AM', 'PM'] as const

/** Minute options at TIME_STEP_MINUTES intervals, zero-padded, e.g. "00", "15", "30", "45". */
export function buildMinuteOptions(stepMinutes: number = TIME_STEP_MINUTES): string[] {
  const options: string[] = []
  for (let minute = 0; minute < 60; minute += stepMinutes) {
    options.push(minute.toString().padStart(2, '0'))
  }
  return options
}

const TIME_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i

/** Splits a combined "H:MM AM/PM" value into its three parts; blank parts if it doesn't parse. */
export function parseTime(value: string): { hour: string; minute: string; period: string } {
  const match = value.match(TIME_RE)
  if (!match) return { hour: '', minute: '', period: '' }
  return { hour: match[1], minute: match[2], period: match[3].toUpperCase() }
}

/** Combines the three parts back into the "H:MM AM/PM" format used elsewhere; '' if any part is missing. */
export function formatTime(hour: string, minute: string, period: string): string {
  if (!hour || !minute || !period) return ''
  return `${hour}:${minute} ${period}`
}
