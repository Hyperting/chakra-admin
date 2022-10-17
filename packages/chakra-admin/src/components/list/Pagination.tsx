/* eslint-disable no-restricted-globals */
import { IconButton, Text, chakra } from '@chakra-ui/react'
import React, { FC, useMemo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Trans } from 'ca-i18n'
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
  totalRows: total,
  offset,
}) => {
  const from = useMemo(() => (total === 0 ? 0 : pageIndex * pageSize + 1), [pageIndex, pageSize, total])
  const to = useMemo(
    () => (pageSize === 0 ? total : Math.min(total, (pageIndex + 1) * pageSize)),
    [pageIndex, pageSize, total]
  )

  return (
    <chakra.div display="flex" alignItems="center">
      <Trans
        i18nKey="ca.pagination.page_info"
        components={{
          strong: <Text fontWeight="bold" mx={1} />,
        }}
        values={{
          from,
          to,
          total,
        }}
      >
        <strong>
          {{ from }}-{{ to }}
        </strong>
        of
        <strong>{{ total }}</strong>
      </Trans>

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
