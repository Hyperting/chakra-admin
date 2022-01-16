import i18n, { Resource, ReadCallback } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Polyglot from 'i18next-polyglot'
import ChainedBackend from 'i18next-chained-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
// import Backend from 'i18next-http-backend'
import { DateTime } from 'luxon'

type ImportFn = (language: string, namespace: string, callback: ReadCallback) => void

/**
 * Default i18next instance used by chakra-admin.
 * It uses the following plugins:
 * - [i18next-browser-languagedetector](https://www.npmjs.com/package/i18next-browser-languagedetector)
 * - [i18next-polyglot](https://www.npmjs.com/package/i18next-polyglot)
 * - [i18next-chained-backend](https://www.npmjs.com/package/i18next-chained-backend)
 * - [i18next-http-backend](https://www.npmjs.com/package/i18next-http-backend)
 * - [i18next-resources-to-backend](https://www.npmjs.com/package/i18next-resources-to-backend)
 * - [react-i18next](https://www.npmjs.com/package/react-i18next)
 *
 * Note: it is not initialized, it is supposed to be initialized by the <Admin> component of the chakra-admin package.
 *
 *
 * @example
 *
 * // if you are using the chakra-admin package
 * ```tsx
 * import { defaultI18n, Admin, Resource } from 'chakra-admin'
 *
 * const App = () => {
 *  return (
 *    <Admin
 *      i18n={defaultI18n}
 *      ... // other props
 *   >
 *      ... // resources and routes
 *   </Admin>
 * ```
 *
 */
export const defaultI18n = i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // ChainedBackend is used to chain i18next-http-backend and i18next-resources-to-backend
  .use(ChainedBackend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // i18next-polyglot
  // use the airbnb/polyglot.js format
  .use(Polyglot)
/**
 * Factory function for default options for i18next used by chakra-admin.
 * for all options refer to i18next documentaion: https://www.i18next.com/overview/configuration-options
 *
 * @param defaultResource - default i18n resource used by ca-i18n
 * @returns default options for i18next used by chakra-admin
 */
export const getDefaultI18nOptions = (defaultResource: Resource | ImportFn) => ({
  debug: true,
  fallbackLng: 'en',
  backend: {
    backends: [
      // i18next-http-backend
      // loads translations from your server
      // https://github.com/i18next/i18next-http-backend
      // Backend,
      resourcesToBackend(defaultResource),
    ],
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
    format: (value, format, lng) => {
      if (value instanceof Date) {
        return DateTime.fromJSDate(value).setLocale(lng).toLocaleString(DateTime[format])
      }
      return value
    },
  },
})
