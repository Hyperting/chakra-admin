import React, { FC, useCallback, useState } from 'react'
import { Box } from '@chakra-ui/layout'
import { BsCalendar2EventFill } from 'react-icons/bs'
import Icon from '@chakra-ui/icon'
import { IconButton } from '@chakra-ui/button'
import { BiPlus } from 'react-icons/bi'
import { MotionBox } from '../../base/motion'
import { ToggleSizeButton } from './ToggleSizeButton'
import { SidebarTitle } from './SidebarTitle'
import { MenuSearch } from './MenuSearch'
import { MenuCollapse } from './MenuCollapse'
import { NavMenu } from './NavMenu'
import { SidebarProjects } from './sidebarProjects/SidebarProjects'

type Props = {
  //
}

export const Sidebar: FC<Props> = ({ ...rest }) => {
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
            <SidebarTitle
              icon={<Icon color="red.600" w={30} h={26} as={BsCalendar2EventFill} />}
              title="A Regola d'Arte"
            />
            <MenuSearch placeholder="Cerca..." mb={5} />
            <Box h="100%" minH="100%" overflowY="auto">
              <MenuCollapse>
                <NavMenu />
              </MenuCollapse>
              <MenuCollapse
                label="Progetti"
                p={0}
                additionalElement={
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    mr={3}
                    color="gray.500"
                    bgColor="transparent"
                    size="xs"
                    aria-label="Create new Project"
                    icon={<Icon as={BiPlus} />}
                  />
                }
              >
                <SidebarProjects />
              </MenuCollapse>
            </Box>
          </Box>
        )}
      </MotionBox>
    </Box>
  )
}
