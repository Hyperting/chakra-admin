import { FC, useCallback } from 'react'
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { Outlet, useNavigate } from 'react-router-dom'

export type ModalRouteLayoutProps = {}

export const ModalRouteLayout: FC<ModalRouteLayoutProps> = () => {
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <Modal isOpen onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <Outlet />
      </ModalContent>
    </Modal>
  )
}
