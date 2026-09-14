import type { TemplateSummary } from '@shared/types'

/**
 * Search narrows by case-insensitive substring match on name; among those results,
 * a template passes the tag filter if it carries ANY of the selected tags (union
 * within tag selection), since templates typically carry only 1-2 tags each and
 * an AND-of-tags filter would too easily return zero results. Swap `.some` for
 * `.every` below if AND-of-tags is ever preferred instead.
 */
export function filterTemplates(
  templates: TemplateSummary[],
  query: string,
  selectedTags: Set<string>
): TemplateSummary[] {
  const normalizedQuery = query.trim().toLowerCase()

  return templates.filter((t) => {
    const nameMatches = normalizedQuery === '' || t.name.toLowerCase().includes(normalizedQuery)
    const tagMatches = selectedTags.size === 0 || t.tags.some((tag) => selectedTags.has(tag))
    return nameMatches && tagMatches
  })
}
