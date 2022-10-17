import { useTranslation, UseTranslationOptions } from 'react-i18next'

export const useTranslate = (options?: UseTranslationOptions<any>) => {
  const { t } = useTranslation(undefined, options)
  return t
}
