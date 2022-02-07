import React, { FC, useCallback, useState } from 'react'
import { Box, BoxProps, Icon, useBreakpointValue } from '@chakra-ui/react'
import { MotionBox } from '../../base/motion'
import { ToggleSizeButton } from './ToggleSizeButton'
import { SidebarTitle } from './SidebarTitle'
import { MenuSearch } from './MenuSearch'
import { MenuCollapse } from './MenuCollapse'
import { ResourcesNavMenu } from './ResourcesNavMenu'
import { AccountBox } from './AccountBox'

type Props = {
  title?: string
  icon?: React.ReactNode
} & BoxProps

export const Sidebar: FC<Props> = ({ title, icon, children, ...rest }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  })

  const handleToggleSize = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  return (
    <Box
      pos="relative"
      boxShadow="0px 3px 12px 1px rgba(37, 31, 30, 0.05)"
      onClick={collapsed ? handleToggleSize : undefined}
      cursor={collapsed ? 'pointer' : 'default'}
      bgColor="white"
      _hover={collapsed ? { opacity: 0.7 } : undefined}
      overflowY="auto"
      {...rest}
    >
      <ToggleSizeButton isCompressed={collapsed} onClick={handleToggleSize} />
      <MotionBox bgColor="white" initial={false} animate={{ width: collapsed ? 18 : 280 }}>
        {!collapsed && (
          <Box overflowX="hidden" w="280px" minW="280px" pt={!isMobile ? 6 : 0}>
            {!isMobile && (
              <>
                <SidebarTitle icon={icon} title={title} />
                <MenuSearch placeholder="Cerca..." mb={5} />
              </>
            )}
            <Box h="100%" minH="100%">
              {children || (
                <MenuCollapse>
                  <ResourcesNavMenu />
                </MenuCollapse>
              )}
            </Box>
          </Box>
        )}
      </MotionBox>
      <AccountBox />
    </Box>
  )
}
