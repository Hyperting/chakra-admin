import React, { FC, useMemo } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { BsPlus } from 'react-icons/bs'
import { Button, ButtonProps, Icon } from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'

type Props = Partial<ListProps> &
  Partial<UseListReturn> & { label?: string | boolean } & ButtonProps &
  Partial<LinkProps>

export const CreateButton: FC<Props> = ({
  basePath = '/',
  label: labelProp,
  resource,
  titleComponent,
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
  hasList,
  deleteItemMutation,
  defaultSorting,
  currentFilters,
  currentSort,
  data,
  error,
  loading,
  limit,
  offset,
  onFiltersChange,
  onPaginationChange,
  onSortChange,
  pageCount,
  refetch,
  total,
  fetchMore,
  updateQuery,
  startPolling,
  stopPolling,
  subscribeToMore,
  called,
  previousData,
  networkStatus,
  to: toProp,
  queryResult,
  children,
  ...rest
}) => {
  const t = useTranslate()
  const to = useMemo(() => toProp || `${basePath}${resource}/create`, [basePath, resource, toProp])
  const getResourceLabel = useGetResourceLabel()

  const label = useMemo(
    () =>
      !resource
        ? undefined
        : typeof labelProp === 'boolean' && !labelProp
        ? undefined
        : typeof labelProp === 'boolean' || !labelProp
        ? t('ca.actions.create', { count: 1, resource: getResourceLabel(resource, 1) })
        : t(labelProp, { count: 1 }),
    [getResourceLabel, labelProp, resource, t]
  )

  return (
    <Button as={Link} to={to} rightIcon={<Icon as={BsPlus} />} {...rest}>
      {children || label}
    </Button>
  )
}
