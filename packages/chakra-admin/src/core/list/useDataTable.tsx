import React, { Children, cloneElement, useEffect, useMemo } from 'react'
import { Column, TableInstance, usePagination, useSortBy, useTable } from 'react-table'
import { chakra } from '@chakra-ui/system'
import { DataTableProps } from '../../components/list/DataTable'
import { SortDirection } from './SortType'
import { MoreMenuHeader } from '../../components/list/MoreMenuHeader'
import { GenericMoreMenuButton } from '../../components/buttons/GenericMoreMenuButton'

export type UseDataTableReturn = {
  foundedColumns: Column<object>[]
} & TableInstance<object>

export const useDataTable = ({
  data,
  pageCount: maxOffset,
  fetching,
  error,
  onPaginationChange,
  onSortChange,
  offset,
  limit,
  total,
  children,
  currentSort,
  currentFilters,
  defaultSorting,
  refetch,
  deleteItemMutation,
  moreMenuHeaderComponent = () => <MoreMenuHeader />,
  moreMenuComponent = <GenericMoreMenuButton />,
  hasCreate,
  hasEdit,
  hasDelete,
  hasShow,
  resource,
}: DataTableProps): UseDataTableReturn => {
  const foundedColumns: Column<object>[] = useMemo(
    () =>
      Children.map(children, (child: React.ReactNode, index) => {
        if (child && (child as any).type && (child as any).props && (child as any).props.source) {
          const childProps = (child as any).props
          const newColumn: any = {
            Header: childProps.label || childProps.source,
            accessor: childProps.source,
            isNumeric: childProps.isNumeric,
            disableSortBy: typeof childProps.sortable === 'boolean' ? !childProps.sortable : false,
          }

          if (childProps.render) {
            newColumn.Cell = childProps.render
          }
          return newColumn
        }
        return undefined
      })?.filter((item) => !!item) || [],
    [children]
  )

  const transformedSort = useMemo(() => {
    const sortKeys = Object.keys(currentSort!)
    if (sortKeys.length > 0) {
      return sortKeys.map((key) => {
        return {
          id: key,
          desc: currentSort![key] !== SortDirection.ASC,
        }
      })
    }

    return []
  }, [currentSort])

  const transformedDefaultSorting = useMemo(() => {
    if (transformedSort.length === 0) {
      const sortKeys = Object.keys(defaultSorting || {})
      if (sortKeys.length > 0) {
        return sortKeys.map((key) => {
          return {
            id: key,
            desc: defaultSorting![key] !== SortDirection.ASC,
          }
        })
      }
    }

    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSorting])

  const tableInstance = useTable(
    {
      columns: foundedColumns,
      manualPagination: true,
      manualSortBy: true,
      initialState: {
        pageIndex: offset,
        pageSize: limit,
        sortBy: [...transformedDefaultSorting, ...transformedSort],
      },
      pageCount: maxOffset,
      // disableSortBy: false,
      data:
        data && Object.keys(data).length > 0 && (data as any)[Object.keys(data)[0]]
          ? (data as any)[Object.keys(data)[0]].data
          : [],
    },
    useSortBy,
    usePagination,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
        // MoreMenu Column
        {
          id: 'moreMenu',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: moreMenuHeaderComponent,
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => {
            return cloneElement(moreMenuComponent as any, {
              id: (row.original as any).id,
              deleteItemMutation,
              onDeleteCompleted: () => refetch!(),
              hasEdit,
              hasCreate,
              hasDelete,
              hasShow,
              resource,
            })
          },
        },
      ])
    }
  )

  const {
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance

  useEffect(() => {
    if (!fetching) {
      onPaginationChange!({
        limit: pageSize,
        offset: pageIndex,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex])

  useEffect(() => {
    if (offset !== pageIndex) {
      tableInstance.gotoPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset])

  useEffect(() => {
    onSortChange!(
      sortBy.reduce((acc, item) => {
        return {
          ...acc,
          [item.id]: item.desc ? SortDirection.DESC : SortDirection.ASC,
        }
      }, {})
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  return {
    foundedColumns,
    ...tableInstance,
  }
}
