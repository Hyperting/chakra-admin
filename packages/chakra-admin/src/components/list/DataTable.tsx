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
  }
// DataTableFC<DataTableProps>
export function DataTable<TItem = Record<string, any>>(props: DataTableProps<TItem>) {
  const { loading, filtersComponent, total, offset, hasEdit, hasShow, resource } = props

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
    state: { pageIndex, pageSize },
  } = useDataTable<TItem>(props)

  const navigate = useNavigate()

  const handleRowClick = useCallback(
    (row: any) => (event: React.MouseEventHandler<HTMLTableRowElement>) => {
      if ((event as any).target !== (event as any).currentTarget) {
        return
      }

      if (hasShow) {
        navigate(`${row.original.id}/show`)
      } else {
        navigate(`${row.original.id}`)
      }
    },
    [hasShow, navigate]
  )

  return (
    <chakra.div pr={{ base: 0, lg: '64px' }}>
      <chakra.div
        display="flex"
        w="100%"
        // pt={{ base: 0, lg: '56px' }}
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
          colorScheme="gray"
          variant="striped"
          size="lg"
          boxShadow="md"
          backgroundColor="white"
          borderRadius="6px"
          {...getTableProps()}
        >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={(column as any).isNumeric}
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
              return (
                <Tr {...row.getRowProps()} role="group">
                  {row.cells.map((cell, cellIndex) => (
                    <Td
                      {...cell.getCellProps()}
                      isNumeric={(cell.column as any).isNumeric}
                      _groupHover={{
                        backgroundColor: 'red.100',
                        cursor: 'pointer',
                      }}
                      fontSize="sm"
                      onClick={handleRowClick(row)}
                      // onClick={(e) => {
                      //   e.preventDefault()
                      //   if (hasShow) {
                      //     history.push(`/${resource}/${cell.row.values.id}`)
                      //   } else if (hasEdit) {
                      //     history.push(`/${resource}/${cell.row.values.id}/edit`)
                      //   }
                      // }}
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
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

DataTable.displayName = 'DataTable'
