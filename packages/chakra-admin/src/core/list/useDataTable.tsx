import React, { Children, cloneElement, ReactElement, useCallback, useEffect, useMemo, useRef } from 'react'
import { Column, TableInstance, usePagination, useSortBy, useTable, useExpanded } from 'react-table'
import { humanize } from 'inflection'
import { Icon, IconButton } from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { BsChevronUp, BsChevronDown } from 'react-icons/bs'
import { DataTableProps } from '../../components/list/DataTable'
import { OffsetSortDirection } from './SortType'
import { MoreMenuHeader } from '../../components/list/MoreMenuHeader'
import { GenericMoreMenuButton } from '../../components/buttons/GenericMoreMenuButton'
import { DataTableValue } from '../../components/list/DataTableValue'
import { CursorOnPageChange, CursorPagination, OffsetPagination } from './useList'
import { useCursorsHistory } from './useCursorsHistory'

export type UseDataTableReturn = {
  foundedColumns: Column<object>[]
  showBackToTop: boolean
} & TableInstance<object>

export function useDataTable<TItem = Record<string, any>>({
  data,
  list,
  pageCount,
  loading,
  error,
  onPageChange,
  onSortChange,
  total,
  children,
  currentFilters,
  defaultSort,
  defaultSorting,
  defaultSortBy,
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
  paginationMode = 'offset',
  pageInfo,
  defaultPerPage,
  ...rest
}: DataTableProps<TItem>): UseDataTableReturn {
  const t = useTranslate({ keyPrefix: `resources.${resource}.fields` })
  const tAll = useTranslate()
  const cursorHistory = useCursorsHistory({
    resource: resource!,
    paginationMode,
    first: (rest as unknown as CursorPagination)?.first,
    last: (rest as unknown as CursorPagination)?.last,
    after: (rest as unknown as CursorPagination)?.after,
    before: (rest as unknown as CursorPagination)?.before,
  }) // used to go back to previous cursor

  const foundedColumns: Column<object>[] = useMemo(
    () =>
      Children.map(children as any, (child: React.ReactNode, index) => {
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
    [children],
  )

  const transformedOffsetSort = useMemo(() => {
    if (paginationMode === 'cursor') {
      return undefined
    }

    const currentSort = (rest as unknown as OffsetPagination)?.currentSort || {}
    const sortKeys = Object.keys(currentSort)
    if (sortKeys.length > 0) {
      return sortKeys.map((key) => {
        return {
          id: key,
          desc: currentSort![key] !== OffsetSortDirection.ASC,
        }
      })
    }

    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationMode, (rest as unknown as OffsetPagination)?.currentSort])

  const transformedOffsetDefaultSorting = useMemo(() => {
    if (paginationMode === 'cursor') {
      return undefined
    }

    if (transformedOffsetSort?.length === 0) {
      const finalDefaultSort = defaultSort || defaultSorting || {}
      const sortKeys = Object.keys(finalDefaultSort)
      if (sortKeys.length > 0) {
        return sortKeys.map((key) => {
          return {
            id: key,
            desc: finalDefaultSort![key] !== OffsetSortDirection.ASC,
          }
        })
      }
    }

    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSort, defaultSorting, paginationMode])

  const finalTransformedOffsetSort = useMemo(() => {
    if (paginationMode === 'cursor') {
      return undefined
    }

    return [...(transformedOffsetDefaultSorting || []), ...(transformedOffsetSort || [])]
  }, [paginationMode, transformedOffsetDefaultSorting, transformedOffsetSort])

  const transformedCursorSortBy = useMemo(() => {
    if (paginationMode === 'offset') {
      return undefined
    }

    const currentSortBy = (rest as unknown as CursorPagination)?.currentSortBy
    const revert = (rest as unknown as CursorPagination)?.revert

    if (currentSortBy) {
      return [
        {
          id: currentSortBy,
          desc: revert,
        },
      ]
    }

    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationMode,
    (rest as unknown as CursorPagination)?.currentSortBy,
    (rest as unknown as CursorPagination)?.revert,
  ])

  const initialSortBy = useMemo(() => {
    if (paginationMode === 'offset') {
      return finalTransformedOffsetSort
    }

    return transformedCursorSortBy
  }, [finalTransformedOffsetSort, paginationMode, transformedCursorSortBy])

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
        ...(paginationMode === 'offset'
          ? {
              pageIndex: (rest as unknown as OffsetPagination).page
                ? (rest as unknown as OffsetPagination).page - 1
                : 0,
              pageSize: (rest as unknown as OffsetPagination).perPage,
            }
          : {
              pageIndex:
                typeof (rest as unknown as CursorPagination).page === 'number' ? (rest as any).page - 1 : undefined,
              pageSize:
                (rest as unknown as CursorPagination).first ||
                (rest as unknown as CursorPagination).last ||
                defaultPerPage,
            }),
        sortBy: initialSortBy,
      },
      pageCount,
      // disableSortBy: false,
      data: list || [],
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
              record: row.original,
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
    },
  )

  const {
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance

  useEffect(() => {
    if (!loading && onPageChange && paginationMode === 'offset') {
      if (paginationMode === 'offset') {
        onPageChange({
          perPage: pageSize,
          page: (pageIndex >= 0 ? pageIndex : 0) + 1,
        })
      } else {
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex])

  useEffect(() => {
    if (paginationMode === 'offset' && (rest as unknown as OffsetPagination).page !== pageIndex + 1) {
      tableInstance.gotoPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(rest as unknown as OffsetPagination)?.page])

  const __bad_dirty_please_change_me_sort_initialized_ref__ = useRef(false)
  useEffect(() => {
    if (!__bad_dirty_please_change_me_sort_initialized_ref__.current) {
      __bad_dirty_please_change_me_sort_initialized_ref__.current = true
      return
    }

    if (onSortChange) {
      if (paginationMode === 'offset') {
        onSortChange(
          sortBy.reduce((acc, item) => {
            return {
              ...acc,
              [item.id]: item.desc ? OffsetSortDirection.DESC : OffsetSortDirection.ASC,
            }
          }, {}),
        )
      } else if (paginationMode === 'cursor') {
        if (sortBy.length) {
          const currentSortBy = sortBy[0]?.id
          const revert = !!sortBy[0]?.desc

          if (currentSortBy) {
            onSortChange({
              sortBy: currentSortBy,
              [revert ? 'last' : 'first']: pageSize,
              revert,
            })
          }
        } else {
          onSortChange({})
        }
        cursorHistory.reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  const revert = useMemo(() => {
    return (rest as unknown as CursorPagination)?.revert
  }, [rest])

  const additonalProps = useMemo(() => {
    if (paginationMode === 'offset') {
      return {}
    }

    return {
      showBackToTop:
        ((rest as unknown as CursorPagination)?.after || (rest as unknown as CursorPagination)?.before) &&
        cursorHistory.length <= 0,
      canNextPage: pageInfo?.hasNextPage,
      canPreviousPage: pageInfo?.hasPreviousPage || cursorHistory.length > 0,
      previousPage: () => {
        if (onPageChange && pageInfo?.hasPreviousPage) {
          ;(onPageChange as CursorOnPageChange)({
            [revert ? 'first' : 'last']: pageSize,
            [revert ? 'after' : 'before']: pageInfo?.startCursor as string,
          })
        } else if (onPageChange && cursorHistory.length > 0) {
          cursorHistory.pop()
          const prevCursor = cursorHistory.getLast()

          if (prevCursor) {
            ;(onPageChange as CursorOnPageChange)({
              [revert ? 'last' : 'first']: pageSize,
              [revert ? 'before' : 'after']: prevCursor,
            })
          } else {
            ;(onPageChange as CursorOnPageChange)({
              [revert ? 'last' : 'first']: pageSize,
            })
          }
        }
      },
      nextPage: () => {
        if (onPageChange && pageInfo?.hasNextPage) {
          cursorHistory.push(pageInfo?.endCursor as any)
          ;(onPageChange as CursorOnPageChange)({
            [revert ? 'last' : 'first']: pageSize,
            [revert ? 'before' : 'after']: pageInfo?.endCursor as string,
          })
        }
      },
      backToTop: () => {
        if (onPageChange) {
          cursorHistory.reset()
          ;(onPageChange as CursorOnPageChange)({
            [revert ? 'last' : 'first']: pageSize,
          })
        }
      },
      state: {
        ...tableInstance.state,
        // pageIndex:
        //   !(rest as CursorPagination)?.page && total
        //     ? 0
        //     : (rest as CursorPagination)?.page
        //     ? ((rest as CursorPagination)?.page || 1) - 1
        //     : undefined,
        pageIndex: cursorHistory.length,
      },
      pageCount,
    }
    // Re-enable this rule when you need to check for new dependencies
  }, [
    paginationMode,
    rest,
    total,
    cursorHistory,
    pageInfo?.hasNextPage,
    pageInfo?.hasPreviousPage,
    pageInfo?.startCursor,
    pageInfo?.endCursor,
    tableInstance.state,
    pageCount,
    onPageChange,
    revert,
    pageSize,
  ])

  return {
    foundedColumns,
    ...tableInstance,
    ...additonalProps,
  }
}
