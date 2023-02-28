/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import React, { cloneElement, FC, isValidElement } from 'react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { chakra, TableBodyProps, TableCellProps, TableHeadProps, TableProps, TableRowProps } from '@chakra-ui/react'
import { CellProps, HeaderProps, Renderer } from 'react-table'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'
import { Pagination } from './Pagination'
import { useDataTable } from '../../core/list/useDataTable'
import { DataTableValueProps } from './DataTableValue'

export type MobileDataTableProps<TItem> = Partial<UseListReturn> &
  Partial<ListProps> & {
    children?: React.ReactElement<DataTableValueProps<TItem>>[]
    filtersComponent?: React.ReactNode
    moreMenuHeaderComponent?: Renderer<HeaderProps<any>> | string
    moreMenuComponent?: Renderer<CellProps<any, any>>
    tableProps: Omit<TableProps, 'children'>
    theadProps: Omit<TableHeadProps, 'children'>
    tbodyProps: Omit<TableBodyProps, 'children'>
    trProps: Omit<TableRowProps, 'children'>
    tdProps: Omit<TableCellProps, 'children'>
  }

export function MobileDataTable<TItem = Record<string, any>>(props: MobileDataTableProps<TItem>) {
  const { loading, filtersComponent, total, paginationMode } = props

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
    showBackToTop,
    backToTop,
    state: { pageIndex, pageSize },
  } = useDataTable<TItem>(props)

  return (
    <chakra.div pr={0}>
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
          paginationMode={paginationMode!}
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
          showBackToTop={showBackToTop}
          backToTop={backToTop}
        />
      </chakra.div>
      <chakra.div px={5} maxW="100%">
        <chakra.div mb={5}>
          {headerGroups.map((headerGroup, index) => (
            <chakra.div {...headerGroup.getHeaderGroupProps()} display="flex" justifyContent="space-between">
              {headerGroup.headers.map((column, columnIndex) => (
                <chakra.div
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
                </chakra.div>
              ))}
            </chakra.div>
          ))}
        </chakra.div>

        <chakra.div {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <chakra.div
                {...row.getRowProps()}
                p={2}
                my={2}
                borderRadius="4px"
                boxShadow="0px 0px 0px 1px rgba(63, 63, 68, 0.05), 0px 1px 3px rgba(63, 63, 68, 0.15)"
                role="group"
                display="grid"
                gridAutoColumns="1fr"
                gridAutoFlow="column"
                justifyItems="end"
              >
                {row.cells.map((cell, cellIndex) => (
                  <chakra.div
                    {...cell.getCellProps()}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    isNumeric={(cell.column as any).isNumeric}
                    // _groupHover={{
                    //   backgroundColor: 'red.100',
                    //   cursor: 'pointer',
                    // }}
                  >
                    {cell.render('Cell')}
                  </chakra.div>
                ))}
              </chakra.div>
            )
          })}
        </chakra.div>
        {/* <Table
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
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              )
            })}
          </Tbody>
        </Table> */}
      </chakra.div>
      <chakra.div display="flex" justifyContent="flex-end" py={5} pr={5}>
        <Pagination
          page={page}
          paginationMode={paginationMode!}
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
          showBackToTop={showBackToTop}
          backToTop={backToTop}
        />
      </chakra.div>
    </chakra.div>
  )
}
