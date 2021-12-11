import { Box, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { OfflineAlert } from './OfflineAlert'
import { Sidebar } from './sidebar/Sidebar'

type Props = {
  //
}
export const Layout: FC<Props> = ({ children }) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <Box d="flex" h="100vh" w="100vw" maxW="100%">
      <OfflineAlert />
      <Sidebar />
      <Box pl="25px" flex="1" bgColor="gray.50">
        {children}
      </Box>
    </Box>
  )
}
