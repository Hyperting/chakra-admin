import React, { FC } from 'react'
import { Drawer, DrawerContent, DrawerOverlay, DrawerFooter, DrawerProps, DrawerCloseButton } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { LogoutButton } from '../buttons/LogoutButton'
import { DrawerBody } from '../modal/DrawerBody'
import { DrawerHeader } from '../modal/DrawerHeader'

type Props = Omit<DrawerProps, 'children'> & {
  //
}
export const UserSettingsDrawer: FC<Props> = ({ isOpen, onClose, ...rest }) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      // closeOnOverlayClick={false}
      {...rest}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader title="Impostazioni Utente" />
          <DrawerBody></DrawerBody>
          <DrawerFooter>
            <LogoutButton mb={4} />
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
