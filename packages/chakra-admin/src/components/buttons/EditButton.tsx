import React, { FC, useMemo } from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { Button, ButtonProps, Icon } from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'

type Props = Partial<ListProps> &
  Partial<UseListReturn> & { label?: string | boolean; openAsModal?: boolean } & ButtonProps &
  Partial<LinkProps>

export const EditButton: FC<Props> = ({
  id,
  basePath = '/',
  label: labelProp,
  resource,
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
  openAsModal = false,
  ...rest
}) => {
  const t = useTranslate()
  const to = useMemo(() => toProp || `${basePath}${resource}/${id}`, [
    basePath,
    id,
    resource,
    toProp,
  ])
  const getResourceLabel = useGetResourceLabel()
  const location = useLocation()

  const label = useMemo(
    () =>
      !resource
        ? undefined
        : typeof labelProp === 'boolean' && !labelProp
        ? undefined
        : typeof labelProp === 'boolean' || !labelProp
        ? t('ca.action.edit', { count: 1, name: getResourceLabel(resource, 1) })
        : t(labelProp, { count: 1 }),
    [getResourceLabel, labelProp, resource, t]
  )

  return (
    <Button
      as={Link}
      to={to}
      state={openAsModal ? { background: location } : undefined}
      rightIcon={<Icon as={FaEdit} />}
      {...rest}
    >
      {children || label}
    </Button>
  )
}
