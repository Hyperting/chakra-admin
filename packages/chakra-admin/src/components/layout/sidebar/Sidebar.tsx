import React, { FC, useCallback, useState } from 'react'
import { Box, BoxProps, useBreakpointValue, chakra } from '@chakra-ui/react'
import { MotionBox } from '../../base/motion'
import { ToggleSizeButton } from './ToggleSizeButton'
import { SidebarTitle } from './SidebarTitle'
import { MenuSearch } from './MenuSearch'
import { MenuCollapse } from './MenuCollapse'
import { ResourcesNavMenu } from './ResourcesNavMenu'
import { AccountBox } from './AccountBox'
import { useLocalStorage } from '../../../core/store/useLocalStorage'

type Props = {
  title?: string
  icon?: React.ReactNode
} & BoxProps

export const Sidebar: FC<Props> = ({ title, icon, children, ...rest }) => {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>('ca-default-sidebar-collapsed', false)

  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  })

  const handleToggleSize = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed, setCollapsed])

  return (
    <Box
      pos="relative"
      boxShadow="main"
      onClick={collapsed ? handleToggleSize : undefined}
      cursor={collapsed ? 'pointer' : 'default'}
      bgColor="white"
      _hover={collapsed ? { opacity: 0.7 } : undefined}
      overflowY="auto"
      {...rest}
    >
      {!isMobile && <ToggleSizeButton isCompressed={collapsed} onClick={handleToggleSize} />}
      <MotionBox bgColor="white" initial={false} animate={{ width: collapsed ? 18 : 280 }}>
        {!collapsed && (
          <Box overflowX="hidden" w="280px" minW="280px" display="flex">
            {!isMobile && (
              <chakra.div position="fixed" backgroundColor="white" zIndex="10">
                <SidebarTitle icon={icon} title={title} pt={6} />
              </chakra.div>
            )}
            <Box minH="100%" overflowY="auto" mt={!isMobile ? '111px' : 0} pb="86px" minW="280px">
              {children || (
                // <MenuCollapse>
                <ResourcesNavMenu />
                // </MenuCollapse>
              )}
            </Box>
            {/* <AccountBox position="fixed" pb={6} bottom={0} zIndex="1" minW="280px" maxW={isMobile ? '100%' : '280px'} /> */}
          </Box>
        )}
      </MotionBox>
    </Box>
  )
}
