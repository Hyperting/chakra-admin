/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import React, { cloneElement, isValidElement, useCallback } from 'react'
import {
  Table,
  TableBodyProps,
  TableCellProps,
  TableContainer,
  TableHeadProps,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
} from '@chakra-ui/react'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'
import { Pagination, PaginationProps } from './Pagination'
import { RowClick, RowClickObject, UseDataTableProps, useDataTable } from '../../core/list/useDataTable'
import { flexRender } from '@tanstack/react-table'
import { DataTableLayout, DataTableLayoutProps } from './DataTableLayout'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useSelectableRowsValue } from '../../core'
import { SelectedRowsToolbar } from './SelectedRowsToolbar'

export function getRowClickRedirect<T>(
  rowClick: RowClick<T> | RowClickObject<T>,
  item: T,
  navigate: ReturnType<typeof useNavigate>,
) {
  if (typeof rowClick === 'function') {
    return rowClick(item)
  }
  if (typeof rowClick === 'object') {
    return getRowClickRedirect(rowClick.redirect || 'edit', item, navigate)
  }
  return rowClick
}

export type DataTableProps<TItem = Record<string, any>> = UseDataTableProps<TItem> & {
  layoutComponent?: React.ReactNode
  selectedRowsToolbarComponent?: React.ReactNode

  tableProps?: Omit<TableProps, 'children'>
  theadProps?: Omit<TableHeadProps, 'children'>
  tbodyProps?: Omit<TableBodyProps, 'children'>
  trProps?: Omit<TableRowProps, 'children'>
  tdProps?: Omit<TableCellProps, 'children'>
}

export function DataTable<TItem = Record<string, any>>({
  layoutComponent = <DataTableLayout />,
  selectedRowsToolbarComponent = <SelectedRowsToolbar />,
  tableProps = {},
  theadProps = {},
  tbodyProps = {},
  trProps = {},
  tdProps = {},
  ...props
}: DataTableProps<TItem>) {
  const {
    loading,
    filtersComponent,
    paginationComponent = <Pagination {...({} as any)} />,
    total,
    resource,
    expandComponent,
    hasEdit,
    hasShow,
    rowClick = 'edit',
  } = props

  const {
    showBackToTop,
    backToTop,
    canPreviousPage,
    previousPage,
    canNextPage,
    nextPage,
    setPageSize,
    pageOptions,
    pageCount,
    pageSize,
    getHeaderGroups,
    getRowModel,
    pageIndex,
    setPageIndex,
  } = useDataTable<TItem>(props)
  const location = useLocation()
  const navigate = useNavigate()
  const selectedRows = useSelectableRowsValue(resource as string)

  // PLEASE MOVE ME TO THE `useDataTable` HOOK
  const handleRowClick = useCallback(
    (row: any) => (event: React.MouseEventHandler<HTMLTableRowElement>) => {
      if ((event as any).target !== (event as any).currentTarget) {
        return
      }

      if (!rowClick) {
        return
      }

      let redirectUrl = getRowClickRedirect(rowClick, row.original, navigate)
      if (redirectUrl === 'show' && hasShow) {
        redirectUrl = `/${resource}/${row.original.id}/show`
      } else if (redirectUrl === 'edit' && hasEdit) {
        redirectUrl = `/${resource}/${row.original.id}`
      }

      if (!redirectUrl) {
        return
      }

      let navigateOptions: NavigateOptions | undefined

      if (typeof rowClick === 'object' && rowClick.asModal) {
        navigateOptions = { state: { background: location } }
      }

      navigate(redirectUrl, navigateOptions)
    },
    [hasEdit, hasShow, location, navigate, resource, rowClick],
  )

  return (
    <>
      {isValidElement(layoutComponent) &&
        cloneElement(
          layoutComponent,
          {
            paginationComponent:
              paginationComponent &&
              isValidElement(paginationComponent) &&
              typeof paginationComponent !== 'string' &&
              cloneElement<PaginationProps>(paginationComponent as any, {
                paginationMode: props.paginationMode!,
                fetching: loading,
                canPreviousPage,
                canNextPage,
                pageOptions,
                pageCount,
                setPageIndex,
                nextPage,
                previousPage,
                setPageSize,
                pageIndex,
                pageSize,
                totalRows: total,
                showBackToTop,
                backToTop,
              }),
            filtersComponent:
              filtersComponent &&
              isValidElement(filtersComponent) &&
              cloneElement(filtersComponent, {
                ...props,
              }),
          } as DataTableLayoutProps,
          [
            selectedRows.length > 0 && isValidElement(selectedRowsToolbarComponent) ? (
              cloneElement(selectedRowsToolbarComponent, {})
            ) : (
              <></>
            ),
            <TableContainer>
              <Table variant="simple" {...tableProps}>
                <Thead {...theadProps}>
                  {getHeaderGroups().map((headerGroup) => (
                    <Tr {...trProps} key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const meta: any = header.column.columnDef.meta as any
                        return (
                          <Th
                            key={header.id}
                            colSpan={header.colSpan}
                            isNumeric={meta?.isNumeric}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.isPlaceholder ? null : (
                              <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                            )}

                            <chakra.span pl="4">
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'desc' ? (
                                  <TriangleDownIcon aria-label="sorted descending" />
                                ) : (
                                  <TriangleUpIcon aria-label="sorted ascending" />
                                )
                              ) : null}
                            </chakra.span>
                          </Th>
                        )
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...tbodyProps}>
                  {getRowModel().rows.map((row) => {
                    return (
                      <Tr key={row.id} role="group" {...trProps}>
                        {row.getVisibleCells().map((cell) => {
                          const meta: any = cell.column.columnDef.meta as any
                          return (
                            <Td
                              key={cell.id}
                              _groupHover={{
                                backgroundColor: 'gray.50',
                                cursor: 'pointer',
                              }}
                              onClick={handleRowClick(row) as any}
                              isNumeric={meta?.isNumeric}
                              {...tdProps}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          )
                        })}
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>,
          ],
        )}
    </>
  )
}

DataTable.displayName = 'CADataTable'
