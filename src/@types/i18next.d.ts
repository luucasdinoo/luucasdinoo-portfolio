import type pt from '../messages/pt.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof pt
    }
  }
}
