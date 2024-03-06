import { Box, Flex, Stack } from '@chakra-ui/react'

export type DataTableLayoutProps = {
  children?: React.ReactNode
  paginationComponent?: React.ReactNode
  filtersComponent?: React.ReactNode
}

export function DataTableLayout({ children, paginationComponent, filtersComponent }: DataTableLayoutProps) {
  return (
    <Stack spacing={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex="1">{filtersComponent}</Box>
        {paginationComponent}
      </Flex>
      {children}
      <Flex justifyContent="flex-end">{paginationComponent}</Flex>
    </Stack>
  )
}
