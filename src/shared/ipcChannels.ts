export const IPC = {
  LIST_TEMPLATES: 'templates:list',
  GET_TEMPLATE: 'templates:get',
  GET_TAGS: 'tags:get',
  GET_DAY_TRANSLATIONS: 'dayTranslations:get',
  COPY_TO_CLIPBOARD: 'clipboard:write',
  SYNC_TEMPLATES: 'templates:sync',
  TEMPLATES_CHANGED: 'templates:changed'
} as const
