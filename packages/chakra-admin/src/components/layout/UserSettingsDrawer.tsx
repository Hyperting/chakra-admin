import { Drawer, DrawerContent, DrawerOverlay, DrawerFooter, DrawerProps } from '@chakra-ui/react'
import React, { FC } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { LogoutButton } from '../buttons/LogoutButton'
import { DrawerBody } from '../modal/DrawerBody'
import { DrawerCloseButton } from '../modal/DrawerCloseButton'
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
          <DrawerCloseButton
            aria-label="Chiudi"
            drawerPlacement={rest.placement === 'left' ? rest.placement : 'right'}
            icon={rest.placement === 'left' ? <FaArrowLeft /> : <FaArrowRight />}
          />
          <DrawerHeader title="Impostazioni Utente" />
          <DrawerBody></DrawerBody>
          <DrawerFooter>
            <LogoutButton mb={4} isFullWidth />
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
