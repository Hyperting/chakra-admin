/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import React, { cloneElement, FC, isValidElement, useCallback } from 'react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { chakra, Heading, Table, Tbody, Td, Th, Thead, Tr, useCallbackRef } from '@chakra-ui/react'
import { CellProps, HeaderProps, Renderer } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'
import { Pagination } from './Pagination'
import { useDataTable } from '../../core/list/useDataTable'
import { DataTableValueProps } from './DataTableValue'

export type DataTableProps<TItem> = Partial<UseListReturn> &
  Partial<ListProps> & {
    children?:
      | React.ReactElement<DataTableValueProps<TItem>>[]
      | React.ReactElement<DataTableValueProps<TItem>>
    filtersComponent?: React.ReactNode
    moreMenuHeaderComponent?: Renderer<HeaderProps<any>> | string
    moreMenuComponent?: Renderer<CellProps<any, any>>
    expandComponent?: React.ReactNode
  }
// DataTableFC<DataTableProps>
export function DataTable<TItem = Record<string, any>>(props: DataTableProps<TItem>) {
  const {
    loading,
    filtersComponent,
    total,
    offset,
    resource,
    expandComponent,
    hasEdit,
    hasShow,
  } = props

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    visibleColumns,
    state: { pageIndex, pageSize },
  } = useDataTable<TItem>(props)

  const navigate = useNavigate()

  const handleRowClick = useCallback(
    (row: any) => (event: React.MouseEventHandler<HTMLTableRowElement>) => {
      if ((event as any).target !== (event as any).currentTarget) {
        return
      }

      if (hasShow) {
        navigate(`/${resource}/${row.original.id}/show`)
      } else {
        navigate(`/${resource}/${row.original.id}`)
      }
    },
    [hasShow, navigate, resource]
  )

  return (
    <chakra.div>
      <chakra.div
        display="flex"
        w="100%"
        pb={5}
        pl={{ base: 5, lg: 0 }}
        pr={{ base: 5, lg: 0 }}
        justifyContent="space-between"
      >
        {filtersComponent &&
          isValidElement(filtersComponent) &&
          cloneElement(filtersComponent, {
            ...props,
          })}
        <Pagination
          page={page}
          fetching={loading}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRows={total || 0}
          offset={offset}
        />
      </chakra.div>
      <chakra.div maxW="100%">
        <Table
          w="100%"
          __css={{
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
          }}
          {...getTableProps()}
        >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr
                bgColor="white"
                my={5}
                boxShadow="sm"
                borderRadius="md"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, columnIndex) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={(column as any).isNumeric}
                    borderBottom="none"
                  >
                    {column.render('Header')}
                    <chakra.span pl="4">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row)
              const rowProps = row.getRowProps()
              return (
                <React.Fragment key={rowProps.key}>
                  <Tr
                    my={5}
                    boxShadow="sm"
                    borderRadius="md"
                    {...rowProps}
                    role="group"
                    bgColor="transparent"
                    sx={{
                      'td:first-child': {
                        borderLeftRadius: 'md',
                      },
                      'td:last-child': {
                        borderRightRadius: 'md',
                      },
                    }}
                  >
                    {row.cells.map((cell, cellIndex) => (
                      <Td
                        {...cell.getCellProps()}
                        isNumeric={(cell.column as any).isNumeric}
                        _groupHover={{
                          backgroundColor: 'gray.50',
                          cursor: 'pointer',
                        }}
                        bgColor="white"
                        borderBottom="none"
                        fontSize="sm"
                        onClick={handleRowClick(row)}
                      >
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </Tr>

                  {row.isExpanded &&
                    expandComponent &&
                    React.cloneElement(expandComponent as React.ReactElement, {
                      record: row.original,
                      rowProps,
                      row,
                      visibleColumns,
                      resource,
                    })}
                </React.Fragment>
              )
            })}
          </Tbody>
        </Table>
      </chakra.div>
      <chakra.div display="flex" justifyContent="flex-end" py={5}>
        <Pagination
          page={page}
          fetching={loading}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRows={total || 0}
          offset={offset}
        />
      </chakra.div>
    </chakra.div>
  )
}

DataTable.displayName = 'CADataTable'
