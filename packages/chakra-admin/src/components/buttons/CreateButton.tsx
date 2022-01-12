import React, { FC, useMemo } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { BsPlus } from 'react-icons/bs'
import { Button, ButtonProps, Icon } from '@chakra-ui/react'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'

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
  listComponent,
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
  ...rest
}) => {
  const to = useMemo(() => toProp || `${basePath}${resource}/create`, [basePath, resource, toProp])
  const label = useMemo(
    () =>
      typeof labelProp === 'boolean' && !labelProp ? undefined : labelProp || `Create ${resource}`,
    [labelProp, resource]
  )

  return (
    <Button as={Link} to={to} colorScheme="red" rightIcon={<Icon as={BsPlus} />} {...rest}>
      {label}
    </Button>
  )
}
