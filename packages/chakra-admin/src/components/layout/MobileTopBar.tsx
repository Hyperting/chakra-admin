import React, { FC } from 'react'
import {
  Text,
  IconButton,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  Skeleton,
  chakra,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaArrowLeft, FaFlag } from 'react-icons/fa'
import { UserMobileButton } from '../buttons/UserMobileButton'
import { DrawerHeader } from '../modal/DrawerHeader'
import { NavMenu } from './sidebar/NavMenu'
import { DrawerBody } from '../modal/DrawerBody'
import { useAuthUser } from '../../core/auth/useAuthUser'
import { OfflineAlert } from './OfflineAlert'

type Props = {
  //
}
export const MobileTopBar: FC<Props> = () => {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const { initialized, user } = useAuthUser()

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
      >
        <chakra.div display="flex">
          <IconButton
            w="45px"
            h="45px"
            ml={3}
            aria-label="Show Menu"
            variant="outline"
            boxShadow="base"
            icon={<GiHamburgerMenu size="23px" />}
            onClick={onToggle}
          />

          {!initialized ? (
            <chakra.div
              ml={5}
              display="flex"
              flexDir="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Skeleton h="10px" w="50px" />
              <Skeleton h="12px" w="80px" />
            </chakra.div>
          ) : user && user.salesPoint && user.salesPoint.name ? (
            <chakra.div
              ml={5}
              display="flex"
              flexDir="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <chakra.span
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                color="gray.900"
                opacity={0.5}
              >
                <FaFlag fontSize="8px" />
                <Text fontSize="x-small" ml={2}>
                  Punto vendita:
                </Text>
              </chakra.span>

              <Text fontSize="sm" fontWeight={800} color="red.500">
                {user.salesPoint.name}
              </Text>
            </chakra.div>
          ) : null}
          <OfflineAlert bottom="-18px" />
        </chakra.div>

        <UserMobileButton />
      </chakra.nav>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader title="Menu" />
            <DrawerBody px={0}>
              <NavMenu onItemClick={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
