import React, { FC, useCallback } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { useGetResourceLabel } from '../../core'

export type DeleteModalProps = {
  resource: string
  id: string
  onDeleteItem: ((id: string) => void) | ((id: string) => Promise<void>)
  deleting: boolean
} & Omit<ModalProps, 'children'>

export const DeleteModal: FC<DeleteModalProps> = ({
  resource,
  id,
  deleting,
  onDeleteItem,
  ...props
}) => {
  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()

  const handleDeleteConfirm = useCallback(() => {
    onDeleteItem(id)
  }, [id, onDeleteItem])

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('ca.message.delete_title', {
            name: resource ? getResourceLabel(resource, 1) : undefined,
            id,
          })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {t('ca.message.delete_content', {
            name: resource ? getResourceLabel(resource, 1) : undefined,
            id,
          })}
        </ModalBody>

        <ModalFooter>
          <Button disabled={deleting} mr={3} onClick={props.onClose}>
            {t('ca.action.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            isLoading={deleting}
            disabled={deleting}
            colorScheme="red"
          >
            {t('ca.action.confirm_delete', {
              name: resource ? getResourceLabel(resource, 1) : undefined,
              id,
            })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
