import React, { FC } from 'react'
import {
  IconButton,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  chakra,
  DrawerCloseButton,
  Icon,
} from '@chakra-ui/react'
import { CgMenuLeft } from 'react-icons/cg'
import { IoIosSearch } from 'react-icons/io'
import { DrawerHeader } from '../modal/DrawerHeader'
import { NavMenu } from './sidebar/NavMenu'
import { DrawerBody } from '../modal/DrawerBody'
import { OfflineAlert } from './OfflineAlert'
import { SidebarTitle } from './sidebar/SidebarTitle'

type Props = {
  title?: string
  icon?: string
}
export const MobileTopBarLight: FC<Props> = ({ title, icon, children }) => {
  const { isOpen, onClose, onToggle } = useDisclosure()

  return (
    <>
      <chakra.nav
        position="fixed"
        as="header"
        role="header"
        top="0px"
        right="0px"
        left="0px"
        bgColor="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        pb={3}
        boxShadow="md"
        zIndex="1"
      >
        <chakra.div display="flex">
          <IconButton
            w="45px"
            h="45px"
            ml={3}
            aria-label="Show Menu"
            variant="outline"
            boxShadow="base"
            icon={<CgMenuLeft size="23px" />}
            onClick={onToggle}
          />

          <OfflineAlert bottom="-18px" />
        </chakra.div>
        <chakra.img src={icon} />
        <IconButton
          mr={3}
          variant="outline"
          boxShadow="base"
          aria-label="Search database"
          icon={<Icon as={IoIosSearch} h={21} w={21} color="gray.500" />}
        />
      </chakra.nav>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <SidebarTitle icon={<img src={icon} />} title={title} pl={0} />
            </DrawerHeader>
            <DrawerBody px={0}>
              <NavMenu onItemClick={onClose} />
              {children}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
