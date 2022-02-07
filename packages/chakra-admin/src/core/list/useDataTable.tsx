import React, { Children, cloneElement, ReactElement, useCallback, useEffect, useMemo } from 'react'
import { Column, TableInstance, usePagination, useSortBy, useTable, useExpanded } from 'react-table'
import { humanize } from 'inflection'
import { chakra, Icon, IconButton } from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { BsChevronUp, BsChevronDown } from 'react-icons/bs'
import { DataTableProps } from '../../components/list/DataTable'
import { SortDirection } from './SortType'
import { MoreMenuHeader } from '../../components/list/MoreMenuHeader'
import { GenericMoreMenuButton } from '../../components/buttons/GenericMoreMenuButton'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'
import { DataTableValue } from '../../components/list/DataTableValue'

export type UseDataTableReturn = {
  foundedColumns: Column<object>[]
} & TableInstance<object>

export function useDataTable<TItem = Record<string, any>>({
  data,
  pageCount: maxOffset,
  loading,
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
  queryResult,
  expandComponent,
}: DataTableProps<TItem>): UseDataTableReturn {
  const t = useTranslate({ keyPrefix: `resources.${resource}.fields` })
  const tAll = useTranslate()
  const strategy = useGlobalStrategy()
  const foundedColumns: Column<object>[] = useMemo(
    () =>
      Children.map(children, (child: React.ReactNode, index) => {
        if (
          child &&
          (child as any).type &&
          (child as any).props &&
          ((child as any).props.source || (child as any).props.sources)
        ) {
          const childProps = (child as any).props
          const newColumn: any = {
            Header: childProps.label
              ? tAll(childProps.label, { smart_count: 1 })
              : typeof childProps.source === 'string'
              ? t(`${childProps.source}`, {
                  defaultValue: humanize(childProps.source),
                  smart_count: 1,
                })
              : '',
            accessor: typeof childProps?.source === 'string' ? childProps?.source : undefined,
            isNumeric: childProps?.isNumeric,
            disableSortBy: typeof childProps.sortable === 'boolean' ? !childProps.sortable : false,
            id:
              !childProps?.source || typeof childProps.source !== 'string'
                ? `data-table-column-${childProps?.source || ''}${index}`
                : undefined,
          }

          if ((child as ReactElement).type === DataTableValue) {
            if (childProps.render) {
              newColumn.Cell = (cellData: any) =>
                childProps.render({ ...data, ...childProps, record: cellData?.cell?.row?.original })
            }
          } else {
            newColumn.Cell = (cellData: any) => {
              return cloneElement(child as any, {
                ...data,
                ...childProps,
                ...cellData,
                record: cellData?.record || cellData?.cell?.row?.original,
              })
            }
          }
          return newColumn
        }
        return undefined
      })?.filter((item) => !!item) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getSubRows = useCallback((row: any, relativeIndex: number) => {
    return []
  }, [])

  const tableInstance = useTable(
    {
      columns: foundedColumns,
      manualPagination: true,
      manualSortBy: true,
      autoResetExpanded: false,
      getSubRows,
      initialState: {
        pageIndex: offset,
        pageSize: limit,
        sortBy: [...transformedDefaultSorting, ...transformedSort],
      },
      pageCount: maxOffset,
      // disableSortBy: false,
      data: strategy?.list.getList(queryResult!) || [],
    },
    useSortBy,
    useExpanded,
    usePagination,
    (hooks) => {
      if (expandComponent) {
        hooks.visibleColumns.push((columns) => [
          ...columns,
          {
            // Make an expander cell
            Header: () => null, // No header
            id: 'expander', // It needs an ID
            Cell: ({ row }) => (
              // Use Cell to render an expander for each row.
              // We can use the getToggleRowExpandedProps prop-getter
              // to build the expander.
              // <chakra.span {...row.getToggleRowExpandedProps()} p={4}>
              //   {row.isExpanded ? <Icon as={BsChevronUp} /> : <Icon as={BsChevronDown} />}
              // </chakra.span>
              <IconButton
                aria-label="Expand"
                variant="ghost"
                icon={<Icon as={row.isExpanded ? BsChevronUp : BsChevronDown} />}
                {...row.getToggleRowExpandedProps()}
              />
            ),
          },
        ])
      }

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
    if (!loading) {
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
