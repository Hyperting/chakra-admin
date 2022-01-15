import { Box, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { OfflineAlert } from './OfflineAlert'
import { Sidebar } from './sidebar/Sidebar'

export type LayoutProps = {
  sidebar?: React.ReactNode
  showOfflineAlert?: boolean
}
export const Layout: FC<LayoutProps> = ({
  sidebar = <Sidebar />,
  showOfflineAlert = true,
  children,
}) => {
  // const isMobile = useBreakpointValue({
  //   base: true,
  //   lg: false,
  // })

  return (
    <Box d="flex" h="100vh" w="100vw" maxW="100%">
      {showOfflineAlert && <OfflineAlert />}
      {sidebar}
      <Box pl="25px" flex="1" bgColor="gray.50">
        <Outlet />
      </Box>
    </Box>
  )
}
