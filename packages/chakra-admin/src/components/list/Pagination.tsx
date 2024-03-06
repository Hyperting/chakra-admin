/* eslint-disable no-restricted-globals */
import { IconButton, Text, chakra, Button } from '@chakra-ui/react'
import React, { FC, useMemo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Trans, useTranslate } from 'ca-i18n'
import { Row } from 'react-table'
import { PaginationMode } from '../../core'

export type PaginationProps = {
  paginationMode: PaginationMode
  showBackToTop?: boolean
  pageCount: number
  pageSize: number
  pageIndex: number
  pageOptions: number[]
  canPreviousPage: boolean
  canNextPage: boolean
  setPageIndex: (updater: ((pageIndex: number) => number) | number) => void
  previousPage: () => void
  nextPage: () => void
  setPageSize: (pageSize: number) => void
  backToTop: () => void
  fetching?: boolean
  totalRows?: number
}

export const Pagination: FC<PaginationProps> = ({
  paginationMode,
  showBackToTop,
  backToTop,
  pageCount,
  pageIndex,
  pageSize,
  fetching,
  canNextPage,
  nextPage,
  canPreviousPage,
  previousPage,
  totalRows,
}) => {
  const t = useTranslate()
  const from = useMemo(() => (totalRows === 0 ? 0 : pageIndex * pageSize + 1), [pageIndex, pageSize, totalRows])
  const to = useMemo(
    () =>
      pageSize === 0
        ? totalRows || 0
        : paginationMode === 'offset'
          ? Math.min(totalRows || 0, (pageIndex + 1) * pageSize)
          : (pageIndex + 1) * pageSize,
    [pageIndex, pageSize, paginationMode, totalRows],
  )

  const total = useMemo(() => (typeof totalRows === 'number' ? totalRows : t('ca.pagination.many')), [t, totalRows])

  return (
    <chakra.div display="flex" alignItems="center">
      <Trans
        i18nKey="ca.pagination.page_info"
        components={{
          strong: <Text fontWeight={typeof totalRows === 'number' ? 'bold' : 'normal'} mx={1} />,
        }}
        values={{
          from,
          to,
          total,
        }}
      >
        <strong>
          <>
            {{ from }}-{{ to }}
          </>
        </strong>
        of
        <strong>
          <>{{ total }}</>
        </strong>
      </Trans>

      {showBackToTop ? (
        <Button size="sm" aria-label="Back to top" leftIcon={<ChevronUpIcon />} variant="outline" onClick={backToTop}>
          {t('ca.pagination.back_to_top')}
        </Button>
      ) : (
        <>
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
        </>
      )}
    </chakra.div>
  )
}
