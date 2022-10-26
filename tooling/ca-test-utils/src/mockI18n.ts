/* eslint-disable import/no-extraneous-dependencies */
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

const mockI18n = i18next.use(initReactI18next)

mockI18n.init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: [],
  defaultNS: '',

  debug: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: { en: {} },
})

export { mockI18n as i18n }
