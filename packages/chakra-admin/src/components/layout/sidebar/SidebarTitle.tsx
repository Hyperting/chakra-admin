import { Box, BoxProps, Heading } from '@chakra-ui/layout'
import React, { FC } from 'react'

type Props = {
  icon: React.ReactNode
  title?: string
} & BoxProps

export const SidebarTitle: FC<Props> = ({ icon, title = 'My Dashboard', ...props }) => {
  return (
    <Box d="flex" alignItems="center" justifyContent="flex-start" pl={6} pb={5} {...props}>
      {icon}
      <Heading pt={1} as="h3" size="sm" color="gray.900" fontWeight={600} ml={3}>
        {title}
      </Heading>
    </Box>
  )
}
