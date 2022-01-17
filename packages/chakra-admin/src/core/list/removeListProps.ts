/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ListProps } from './ListProps'

export const removeListProps = (props: ListProps): any => {
  const {
    resource,
    basePath,
    title,
    filtersComponent,
    toolbarComponent,
    query,
    showMoreMenu,
    showMoreMenuEdit,
    showMoreMenuDelete,
    hasDelete,
    hasEdit,
    hasCreate,
    hasShow,
    ...rest
  } = props
  return rest
}
