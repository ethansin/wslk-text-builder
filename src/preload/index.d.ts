import type { TextBuilderAPI } from './index'

declare global {
  interface Window {
    api: TextBuilderAPI
  }
}
