import { Box, BoxProps, Stack } from '@chakra-ui/react'
import { UseListReturn, useSelectableRowsValue } from '../../core'
import { Children, createElement } from 'react'

export type SelectedRowsToolbarProps = Partial<UseListReturn> & {
  selectedLabel?: string
} & BoxProps

export function SelectedRowsToolbar({
  called,
  client,
  currentFilters,
  data,
  error,
  fetchMore,
  list,
  loading,
  networkStatus,
  observable,
  onFiltersChange,
  onPageChange,
  onSortChange,
  page,
  pageCount,
  pageInfo,
  paginationMode,
  previousData,
  queryResult,
  refetch,
  reobserve,
  startPolling,
  stopPolling,
  subscribeToMore,
  total,
  updateQuery,
  variables,
  selectedLabel = 'Selected',
  children,
  ...rest
}: SelectedRowsToolbarProps) {
  const selectedRows = useSelectableRowsValue()

  return (
    <Box
      fontWeight="bold"
      borderRadius="md"
      py={2}
      px={2}
      bgColor="red.100"
      border="1px solid"
      borderColor="red.500"
      display="flex"
      justifyContent="space-between"
      {...rest}
    >
      <Box>
        {selectedLabel} ({selectedRows.length})
      </Box>

      <Stack gap={2}>
        {Children.map(children, (child: any) => {
          const { ...restProps } = child.props
          return createElement(child.type, {
            ...{
              ...rest,
              ...restProps,
            },
          })
        })}
      </Stack>
    </Box>
  )
}
