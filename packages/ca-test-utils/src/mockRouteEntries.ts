// eslint-disable-next-line import/no-extraneous-dependencies
import { InitialEntry } from 'history'

type Availability = Record<'list' | 'create' | 'edit' | 'show', boolean>

export const generateMockRouteEntries = (
  resources: string[],
  availability: Availability = {
    list: true,
    create: true,
    edit: true,
    show: true,
  }
): InitialEntry[] => {
  const entries: InitialEntry[] = []

  resources.forEach((resource) => {
    if (availability.list) {
      entries.push({
        pathname: `/${resource}`,
      })
    }

    if (availability.create) {
      entries.push({
        pathname: `/${resource}/create`,
      })
    }

    if (availability.edit) {
      entries.push({
        pathname: `/${resource}/1/edit`,
      })
    }

    if (availability.show) {
      entries.push({
        pathname: `/${resource}/1`,
      })
    }
  })

  return entries
}
