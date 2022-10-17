import { useTranslate } from 'ca-i18n'
import { useCallback } from 'react'
import { humanize, pluralize, singularize } from 'inflection'

export const useGetResourceLabel = () => {
  const t = useTranslate()

  const getResourceLabel = useCallback(
    (resource: string, count = 2) => {
      return t(`resources.${resource}.label`, {
        smart_count: count,
        defaultValue: humanize(count > 1 ? pluralize(resource) : singularize(resource)),
      })
    },
    [t]
  )

  return getResourceLabel
}
