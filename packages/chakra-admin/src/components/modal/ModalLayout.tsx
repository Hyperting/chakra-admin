import React, { FC, useCallback } from 'react'
import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react'
import { Outlet, useNavigate } from 'react-router-dom'

export type ModalLayoutProps = {}

export const ModalLayout: FC<ModalLayoutProps> = () => {
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <Drawer isOpen placement="right" size="lg" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <Outlet />
      </DrawerContent>
    </Drawer>
  )
}
