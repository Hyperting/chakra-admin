import { chakra } from '@chakra-ui/system'
import { IconButton, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Row } from 'react-table'

type Props = {
  page: Row<object>[]
  pageCount: number
  pageSize: number
  pageIndex: number
  pageOptions: number[]
  canPreviousPage: boolean
  canNextPage: boolean
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void
  previousPage: () => void
  nextPage: () => void
  setPageSize: (pageSize: number) => void
  fetching?: boolean
  totalRows: number
  offset?: number
}

export const Pagination: FC<Props> = ({
  pageCount,
  pageIndex,
  pageSize,
  fetching,
  canNextPage,
  nextPage,
  canPreviousPage,
  previousPage,
  totalRows,
  offset,
}) => {
  return (
    <chakra.div display="flex" alignItems="center">
      <Text fontWeight="bold">
        {`${totalRows === 0 ? 0 : pageIndex * pageSize + 1}-${
          pageSize === 0 ? totalRows : Math.min(totalRows, (pageIndex + 1) * pageSize)
        }`}
      </Text>
      <Text ml={1}>di</Text>
      <Text fontWeight="bold" ml={1}>
        {totalRows}
      </Text>

      <IconButton
        ml={5}
        size="sm"
        aria-label="vai alla pagina precedente"
        icon={<ChevronLeftIcon />}
        onClick={previousPage}
        variant="outline"
        disabled={!canPreviousPage}
      />
      <IconButton
        ml={2}
        size="sm"
        aria-label="vai alla pagina successiva"
        icon={<ChevronRightIcon />}
        onClick={nextPage}
        variant="outline"
        disabled={!canNextPage}
      />
    </chakra.div>
  )
}
