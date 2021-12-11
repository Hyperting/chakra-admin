import { IconButton } from '@chakra-ui/button'
import Icon from '@chakra-ui/icon'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import React, { FC, useCallback, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { Client, TypedDocumentNode, useClient } from 'urql'
import { RouteAvailability } from '../../core/admin/RouteAvailability.js'

type Props<Data = object, Variables = any> = {
  deleteItemMutation?: string | DocumentNode | TypedDocumentNode<Data, Variables>
  onDelete?: (id: string) => void
  onDeleteCompleted?: () => void
  id?: string
  confirmDialogTitle?: string
  confirmDialogBody?: string
  showConfirmDialogOnDelete?: boolean
  confirmDialogCancelButtonLabel?: string
  confirmDialogConfirmDeleteButtonLabel?: string
  resource?: string
} & RouteAvailability

export const GenericMoreMenuButton: FC<Props> = ({
  deleteItemMutation,
  onDelete,
  onDeleteCompleted,
  confirmDialogBody = 'Sei sicuro di voler eliminare questo elemento?',
  confirmDialogTitle = 'Elimina Risorsa',
  confirmDialogCancelButtonLabel = 'Annulla',
  confirmDialogConfirmDeleteButtonLabel = 'Elimina risorsa',
  showConfirmDialogOnDelete = true,
  id,
  resource,
  hasEdit,
  hasShow,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const location = useLocation()
  const client = useClient()
  const notify = useToast()
  const [fetching, setFetching] = useState<boolean>(false)

  const handleDeleteItem = useCallback(async () => {
    if (onDelete) {
      onDelete(id!)
    } else {
      try {
        setFetching(true)
        const result = await client.mutation(deleteItemMutation!, { id }).toPromise()
        if (result.error && result.error.graphQLErrors.length > 0) {
          throw new Error(`Error deleting resource with id:${id}`)
        } else {
          notify({
            status: 'success',
            title: 'Risorsa eliminata correttamente',
            isClosable: true,
          })
          onClose()
          if (onDeleteCompleted) {
            onDeleteCompleted()
          }
        }
      } catch (error) {
        console.error('Error during delete', error)
        notify({
          status: 'error',
          position: 'top',
          isClosable: true,
          title: 'Errore!',
          // eslint-disable-next-line @typescript-eslint/quotes
          description: "C'è stato un problema con l'eliminazione della risorsa, riprova più tardi.",
        })
      } finally {
        setFetching(false)
      }
    }
  }, [client, deleteItemMutation, id, notify, onClose, onDelete, onDeleteCompleted])

  const handleMenuItemDeleteClick = useCallback(() => {
    if (showConfirmDialogOnDelete) {
      onOpen()
    } else {
      handleDeleteItem()
    }
  }, [handleDeleteItem, onOpen, showConfirmDialogOnDelete])

  return (
    <>
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          variant="ghost"
          aria-label="Più opzioni"
          ml={3}
          color="blackAlpha.700"
          icon={<Icon as={FiMoreVertical} />}
        />
        <MenuList border="0px">
          {hasEdit && (
            <MenuItem
              as={Link}
              to={{ pathname: `/${resource}/${id}/edit`, state: { background: location } }}
              icon={<Icon as={FaEdit} />}
            >
              Modifica
            </MenuItem>
          )}
          {deleteItemMutation && (
            <MenuItem
              onClick={handleMenuItemDeleteClick}
              color="red.500"
              icon={<Icon color="red.400" as={FaTrash} />}
            >
              Elimina
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{confirmDialogTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{confirmDialogBody}</ModalBody>

          <ModalFooter>
            <Button disabled={fetching} mr={3} onClick={onClose}>
              {confirmDialogCancelButtonLabel}
            </Button>
            <Button
              onClick={handleDeleteItem}
              isLoading={fetching}
              disabled={fetching}
              colorScheme="red"
            >
              {confirmDialogConfirmDeleteButtonLabel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

  // return (
  //   <IconButton
  //     variant="ghost"
  //     minW="20px"
  //     w="20px"
  //     colorScheme="red"
  //     aria-label="Più opzioni"
  //     color="blackAlpha.700"
  //     icon={<Icon as={FiMoreVertical} />}
  //   />
  // )
}
