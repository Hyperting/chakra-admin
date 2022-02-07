import { Box, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { MobileTopBarLight } from './MobileTopBarLight'
import { OfflineAlert } from './OfflineAlert'
import { Sidebar } from './sidebar/Sidebar'

export type RouteLayoutProps = {
  sidebar?: React.ReactNode
  showOfflineAlert?: boolean
}
export const RouteLayout: FC<RouteLayoutProps> = ({
  sidebar = <Sidebar />,
  showOfflineAlert = true,
  children,
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <Box d="flex" h="100vh" w="100vw" maxW="100%" overflow="hidden">
      {showOfflineAlert && <OfflineAlert />}
      {isMobile ? <MobileTopBarLight>{sidebar}</MobileTopBarLight> : sidebar}
      <Box
        pl={isMobile ? 0 : '25px'}
        pt={isMobile ? '25px' : 0}
        mt={isMobile ? 16 : 0}
        flex="1"
        bgColor="gray.50"
        overflowY="auto"
      >
        <Outlet />
      </Box>
    </Box>
  )
}
