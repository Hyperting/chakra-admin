/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import React, { cloneElement, isValidElement, useCallback } from 'react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { chakra, Table, Tbody, Td, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react'
import { CellProps, HeaderProps, Renderer } from 'react-table'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'
import { Pagination } from './Pagination'
import { useDataTable } from '../../core/list/useDataTable'
import { DataTableValueProps } from './DataTableValue'

export type RowClickObject<T> = {
  redirect?: RowClick<T>
  asModal?: boolean
}

export type RowClick<T> = 'show' | 'edit' | false | ((item: T) => string)

export type DataTableProps<TItem> = Partial<UseListReturn> &
  Partial<ListProps> & {
    children?:
      | React.ReactElement<DataTableValueProps<TItem>>[]
      | React.ReactElement<DataTableValueProps<TItem>>
    filtersComponent?: React.ReactNode
    moreMenuHeaderComponent?: Renderer<HeaderProps<any>> | string
    moreMenuComponent?: Renderer<CellProps<any, any>>
    expandComponent?: React.ReactNode
    rowClick?: RowClick<TItem> | RowClickObject<TItem>
  }

function getRowClickRedirect<T>(
  rowClick: RowClick<T> | RowClickObject<T>,
  item: T,
  navigate: ReturnType<typeof useNavigate>
) {
  if (typeof rowClick === 'function') {
    return rowClick(item)
  }
  if (typeof rowClick === 'object') {
    return getRowClickRedirect(rowClick.redirect || 'edit', item, navigate)
  }
  return rowClick
}

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
    rowClick = 'edit',
  } = props

  // useRegisterLayoutComponent(DataTable as any)

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
  const location = useLocation()
  const navigate = useNavigate()
  //   const isMobile = useBreakpointValue({ base: true, md: false })

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
    [hasEdit, hasShow, location, navigate, resource, rowClick]
  )
  //   console.log('222222222: ', props)

  return (
    <chakra.div w="100%">
      <chakra.div
        display="flex"
        w="100%"
        mb={5}
        pl={{ base: 5, lg: 0 }}
        pr={{ base: 5, lg: 0 }}
        justifyContent="space-between"
        position="sticky"
        top={0}
        // top={isMobile ? '25px' : '80px'}
        // top={props && props.expandComponent === false ? '57px' : '90px'}
        bgColor="gray.50"
        // border="2px solid green"
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
