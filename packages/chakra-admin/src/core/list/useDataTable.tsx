import React, { Children, cloneElement, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Column,
  ColumnDef,
  ColumnDefTemplate,
  getCoreRowModel,
  PaginationState,
  SortingState,
  StringOrTemplateHeader,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import { humanize } from 'inflection'
import { useTranslate } from 'ca-i18n'
import { OffsetSortDirection } from './SortType'
import { MoreMenuHeader } from '../../components/list/MoreMenuHeader'
import { GenericMoreMenuButton } from '../../components/buttons/GenericMoreMenuButton'
import { DataTableValue, DataTableValueProps } from '../../components/list/DataTableValue'
import { CursorOnPageChange, CursorPagination, OffsetOnPageChange, OffsetPagination, UseListReturn } from './useList'
import { useCursorsHistory } from './useCursorsHistory'
import { ListProps } from './ListProps'
import { useLocation, useNavigate } from 'react-router-dom'
import { Checkbox } from '@chakra-ui/react'
import { SelectColumnCheckbox } from '../../components/list/SelectColumnCheckbox'
import { SelectableHeader } from '../../components/list/SelectableHeader'

export type RowClickObject<T> = {
  redirect?: RowClick<T>
  asModal?: boolean
}

export type RowClick<T> = 'show' | 'edit' | false | ((item: T) => string)

export type UseDataTableProps<TItem = Record<string, any>> = Partial<UseListReturn> &
  Partial<Omit<ListProps, 'layout'>> & {
    children?: React.ReactElement<DataTableValueProps<TItem>>[] | React.ReactElement<DataTableValueProps<TItem>>
    filtersComponent?: React.ReactNode
    moreMenuHeaderComponent?: StringOrTemplateHeader<TItem, any>
    moreMenuComponent?: React.ReactNode
    expandComponent?: React.ReactNode
    paginationComponent?: React.ReactNode
    rowClick?: RowClick<TItem> | RowClickObject<TItem>
    selectable?: boolean
    selectRowComponent?: React.ReactNode
    selectableHeaderComponent?: React.ReactNode
  }

export type UseDataTableReturn<TItem = Record<string, any>> = {
  foundedColumns: Column<TItem>[]
  showBackToTop: boolean
  backToTop: () => void
  canPreviousPage: boolean
  canNextPage: boolean
  pageSize: number
  pageOptions: number[]
  pageCount: number
  pageIndex: number
} & Table<TItem>

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
  defaultPerPage = 20,
  selectable,
  selectRowComponent = <SelectColumnCheckbox />,
  selectableHeaderComponent = <SelectableHeader />,
  ...rest
}: UseDataTableProps<TItem>): UseDataTableReturn<TItem> {
  const location = useLocation()
  const navigate = useNavigate()
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

  const foundedColumns: Column<TItem, any>[] = useMemo(
    () => [
      ...(selectable
        ? [
            {
              id: 'selection',
              header: () =>
                cloneElement(selectableHeaderComponent as any, {
                  list,
                  resource,
                }),

              cell: (cellData) => {
                return cloneElement(selectRowComponent as any, {
                  rowId: (cellData.row.original as any).id,
                  resource,
                })
              },
            } as ColumnDef<TItem, any>,
          ]
        : []),
      ...(Children.map(children as any, (child: React.ReactNode, index) => {
        if (
          child &&
          (child as any).type &&
          (child as any).props &&
          ((child as any).props.source || (child as any).props.sources)
        ) {
          const childProps = (child as any).props
          let newColumn: ColumnDef<TItem, any> = {
            header: childProps.label
              ? tAll(childProps.label, { smart_count: 1 })
              : typeof childProps.source === 'string'
                ? t(`${childProps.source}`, {
                    defaultValue: humanize(childProps.source),
                    smart_count: 1,
                  })
                : '',
            accessorKey: typeof childProps?.source === 'string' ? childProps?.source : undefined,
            enableSorting: typeof childProps.sortable === 'boolean' ? childProps.sortable : true,
            id:
              !childProps?.source || typeof childProps.source !== 'string'
                ? `data-table-column-${childProps?.source || ''}${index}`
                : undefined,
          }

          if (childProps.isNumeric) {
            newColumn.meta = { isNumeric: true }
          }

          if ((child as ReactElement).type === DataTableValue) {
            if (childProps.render) {
              newColumn.cell = (cellData: any) =>
                childProps.render({ ...data, ...childProps, record: cellData?.cell?.row?.original })
            }
          } else {
            newColumn.cell = (cellData: any) => {
              return cloneElement(child as any, {
                ...data,
                ...childProps,
                ...cellData,
                record: cellData?.record || cellData?.cell?.row?.original,
              })
            }
          }
          return newColumn as any
        }
        return undefined
      })?.filter((item) => !!item) || []),
      {
        id: 'actions',
        header: moreMenuHeaderComponent,
        cell: (cellData) => {
          return cloneElement(moreMenuComponent as any, {
            id: (cellData.row.original as any).id,
            record: cellData.row.original,
            deleteItemMutation,
            onDeleteCompleted: () => refetch!(),
            hasEdit,
            hasCreate,
            hasDelete,
            hasShow,
            resource,
          })
        },
      } as ColumnDef<TItem, any>,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children],
  )

  const pagination: PaginationState = useMemo(() => {
    if (paginationMode === 'offset') {
      return {
        pageIndex: (rest as unknown as OffsetPagination).page ? (rest as unknown as OffsetPagination).page - 1 : 0,
        pageSize: (rest as unknown as OffsetPagination).perPage || defaultPerPage,
      }
    } else {
      return {
        pageIndex: (rest as unknown as CursorPagination).page ? (rest as any).page - 1 : 0,
        pageSize:
          (rest as unknown as CursorPagination).first || (rest as unknown as CursorPagination).last || defaultPerPage,
      }
    }
  }, [paginationMode, rest, defaultPerPage])

  const revert = useMemo(() => {
    return (rest as unknown as CursorPagination)?.revert
  }, [rest])

  const onPaginationChange = useCallback(
    (page) => {
      const result = page(pagination)

      if (paginationMode === 'offset') {
        ;(onPageChange as OffsetOnPageChange)({
          page: result.pageIndex + 1,
          perPage: result.pageSize,
        })
      } else {
        // can't skip pages in cursor pagination
        if (result.pageIndex > pagination.pageIndex + 1 && result.pageIndex > 0) {
          throw new Error('Can not skip pages in cursor pagination')
        }

        const isPaginatingForward = result.pageIndex > pagination.pageIndex

        if (isPaginatingForward) {
          if (onPageChange && pageInfo?.hasNextPage) {
            cursorHistory.push(pageInfo?.endCursor as any)
            ;(onPageChange as any)({
              [revert ? 'last' : 'first']: result.pageSize,
              [revert ? 'before' : 'after']: pageInfo?.endCursor as string,
              page: result.pageIndex + 1,
              perPage: result.pageSize,
            })
          }
        } else {
          if (onPageChange && pageInfo?.hasPreviousPage) {
            ;(onPageChange as any)({
              [revert ? 'first' : 'last']: result.pageSize,
              [revert ? 'after' : 'before']: pageInfo?.startCursor as string,
              page: result.pageIndex + 1,
              perPage: result.pageSize,
            })
          } else if (onPageChange && cursorHistory.length > 0) {
            cursorHistory.pop()
            const prevCursor = cursorHistory.getLast()

            if (prevCursor) {
              ;(onPageChange as any)({
                [revert ? 'last' : 'first']: result.pageSize,
                [revert ? 'before' : 'after']: prevCursor,
                page: result.pageIndex + 1,
              })
            } else {
              ;(onPageChange as CursorOnPageChange)({
                [revert ? 'last' : 'first']: result.pageSize,
              })
            }
          }
        }
      }
    },
    [pagination, onPageChange, paginationMode, pageInfo, cursorHistory, revert],
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
          desc: currentSort?.[key] !== OffsetSortDirection.ASC,
        }
      })
    }

    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationMode, (rest as unknown as OffsetPagination)?.currentSort])

  const transformedOffsetDefaultSorting: SortingState = useMemo(() => {
    if (paginationMode === 'cursor') {
      return []
    }

    if (transformedOffsetSort?.length === 0) {
      const finalDefaultSort = defaultSort || defaultSorting || {}
      const sortKeys = Object.keys(finalDefaultSort)
      if (sortKeys.length > 0) {
        return sortKeys.map((key) => {
          return {
            id: key,
            desc: finalDefaultSort?.[key] !== OffsetSortDirection.ASC,
          }
        })
      }
    }

    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSort, defaultSorting, paginationMode])

  const finalTransformedOffsetSort: SortingState = useMemo(() => {
    if (paginationMode === 'cursor') {
      return []
    }

    return [...(transformedOffsetDefaultSorting || []), ...(transformedOffsetSort || [])]
  }, [paginationMode, transformedOffsetDefaultSorting, transformedOffsetSort])

  const transformedCursorSortBy: SortingState = useMemo(() => {
    if (paginationMode === 'offset') {
      return []
    }

    const currentSortBy = (rest as unknown as CursorPagination)?.currentSortBy
    const revert = (rest as unknown as CursorPagination)?.revert

    if (currentSortBy) {
      return [
        {
          id: currentSortBy,
          desc: !!revert,
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

  const sorting: SortingState = useMemo(() => {
    if (paginationMode === 'offset') {
      return finalTransformedOffsetSort
    }

    return transformedCursorSortBy
  }, [paginationMode, finalTransformedOffsetSort, transformedCursorSortBy])

  const onSortingChange = useCallback(
    (sort) => {
      const result = sort(sorting)
      console.log('sort', sort, result)

      if (!onSortChange) {
        return
      }

      if (paginationMode === 'offset') {
        onSortChange(
          result.reduce((acc, item) => {
            return {
              ...acc,
              [item.id]: item.desc ? OffsetSortDirection.DESC : OffsetSortDirection.ASC,
            }
          }, {}),
        )
      } else {
        const newSortBy = result?.[0]?.id
        const revert = !!result?.[0]?.desc

        if (newSortBy) {
          onSortChange({
            sortBy: newSortBy,
            [revert ? 'last' : 'first']: pagination.pageSize,
            revert,
          } as any)
        } else {
          onSortChange({})
        }

        cursorHistory.reset()
      }
    },
    [sorting, onSortChange, paginationMode, pagination.pageSize, cursorHistory],
  )

  const defaultData = useMemo(() => [], [])
  const tableInstance = useReactTable<TItem>({
    columns: foundedColumns,
    data: (list ?? defaultData) as TItem[],
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange,
    onSortingChange,
    pageCount,
    manualPagination: true,
    manualSorting: true,
  })

  const showBackToTop = useMemo(
    () =>
      !!(
        ((rest as unknown as CursorPagination)?.after || (rest as unknown as CursorPagination)?.before) &&
        cursorHistory.length <= 0
      ),
    [rest, cursorHistory],
  )

  const backToTop = useCallback(() => {
    if (paginationMode === 'offset') {
      throw new Error('backToTop is not supported in offset pagination mode')
    }

    if (onPageChange) {
      cursorHistory.reset()
      ;(onPageChange as CursorOnPageChange)({
        [revert ? 'last' : 'first']: pagination.pageSize,
      })
    }
  }, [pagination.pageSize, onPageChange, revert, cursorHistory, paginationMode])

  return {
    ...tableInstance,
    foundedColumns,
    showBackToTop,
    backToTop,
    canPreviousPage: tableInstance.getCanPreviousPage(),
    canNextPage: tableInstance.getCanNextPage(),
    pageOptions: tableInstance.getPageOptions(),
    pageSize: tableInstance.getState().pagination.pageSize,
    pageCount: tableInstance.getPageCount(),
    pageIndex: tableInstance.getState().pagination.pageIndex,
  }
}
