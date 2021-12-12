import React, { FC, useCallback, useState } from 'react'
import { Box, BoxProps, Icon } from '@chakra-ui/react'
import { MotionBox } from '../../base/motion'
import { ToggleSizeButton } from './ToggleSizeButton'
import { SidebarTitle } from './SidebarTitle'
import { MenuSearch } from './MenuSearch'
import { MenuCollapse } from './MenuCollapse'
import { NavMenu } from './NavMenu'

type Props = {
  title?: string
  icon?: React.ElementType
} & BoxProps

export const Sidebar: FC<Props> = ({ title, icon, ...rest }) => {
  const [compressed, setCompressed] = useState<boolean>(false)

  const handleToggleSize = useCallback(() => {
    setCompressed(!compressed)
  }, [compressed])

  return (
    <Box
      pos="relative"
      boxShadow="0px 3px 12px 1px rgba(37, 31, 30, 0.05);"
      onClick={compressed ? handleToggleSize : undefined}
      cursor={compressed ? 'pointer' : 'default'}
      bgColor="white"
      _hover={compressed ? { opacity: 0.7 } : undefined}
      {...rest}
    >
      <ToggleSizeButton isCompressed={compressed} onClick={handleToggleSize} />

      <MotionBox bgColor="white" initial={false} animate={{ width: compressed ? 18 : 280 }}>
        {!compressed && (
          <Box overflowX="hidden" w="280px" minW="280px" pt={6}>
            <SidebarTitle icon={<Icon as={icon} color="red.600" w={30} h={26} />} title={title} />
            <MenuSearch placeholder="Cerca..." mb={5} />
            <Box h="100%" minH="100%" overflowY="auto">
              <MenuCollapse>
                <NavMenu />
              </MenuCollapse>
            </Box>
          </Box>
        )}
      </MotionBox>
    </Box>
  )
}
