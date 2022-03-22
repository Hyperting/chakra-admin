import { OperationVariables, TypedDocumentNode, useApolloClient } from '@apollo/client'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
  Icon,
  IconButton,
} from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { DocumentNode } from 'graphql'
import React, { FC, useCallback, useState } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { RouteAvailability } from '../../core/admin/RouteAvailability'
import { useGlobalStrategy } from '../../core/admin/useGlobalStrategy'
import { DeleteModal } from '../modal'

export type GenericMoreMenuButtonProps<Data = any, Variables = OperationVariables> = {
  deleteItemMutation?: DocumentNode | TypedDocumentNode<Data, Variables>
  onDelete?: (id: string) => void
  onDeleteCompleted?: () => void
  id?: string
  confirmDialogTitle?: string
  confirmDialogBody?: string
  showConfirmDialogOnDelete?: boolean
  confirmDialogCancelButtonLabel?: string
  confirmDialogConfirmDeleteButtonLabel?: string
  resource?: string
  openShowAsModal?: boolean
  openEditAsModal?: boolean
  hideDelete?: boolean
  hideEdit?: boolean
  hideShow?: boolean
} & RouteAvailability

export const GenericMoreMenuButton: FC<GenericMoreMenuButtonProps> = ({
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
  openShowAsModal,
  openEditAsModal,
  hideShow,
  hideEdit,
  hideDelete,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const t = useTranslate()
  const location = useLocation()
  const client = useApolloClient()
  const notify = useToast()
  const [fetching, setFetching] = useState<boolean>(false)
  const strategy = useGlobalStrategy()

  const handleDeleteItem = useCallback(
    async (id: string) => {
      if (onDelete) {
        onDelete(id!)
      } else {
        try {
          const variables = strategy?.delete.getVariables(id!)
          if (!variables) {
            throw new Error('Variables not found in DeleteStrategy.getVariables()')
          }

          setFetching(true)
          const result = await client.mutate({
            mutation: deleteItemMutation!,
            variables,
          })
          if (result.errors && result.errors.length > 0) {
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
            description:
              "C'è stato un problema con l'eliminazione della risorsa, riprova più tardi.",
          })
        } finally {
          setFetching(false)
        }
      }
    },
    [client, deleteItemMutation, notify, onClose, onDelete, onDeleteCompleted, strategy?.delete]
  )

  const handleMenuItemDeleteClick = useCallback(() => {
    if (showConfirmDialogOnDelete) {
      onOpen()
    } else {
      handleDeleteItem(id!)
    }
  }, [handleDeleteItem, id, onOpen, showConfirmDialogOnDelete])

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
          {hasShow && !hideShow && (
            <MenuItem
              as={Link}
              to={`/${resource}/${id}/show`}
              state={openShowAsModal ? { background: location } : undefined}
              icon={<Icon as={BsFillEyeFill} />}
            >
              {t('ca.action.show')}
            </MenuItem>
          )}
          {hasEdit && !hideEdit && (
            <MenuItem
              as={Link}
              to={`/${resource}/${id}`}
              state={openEditAsModal ? { background: location } : undefined}
              icon={<Icon as={FaEdit} />}
            >
              {t('ca.action.edit')}
            </MenuItem>
          )}
          {deleteItemMutation && !hideDelete && (
            <MenuItem
              onClick={handleMenuItemDeleteClick}
              color="red.500"
              icon={<Icon color="red.400" as={FaTrash} />}
            >
              {t('ca.action.delete')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <DeleteModal
        resource={resource!}
        id={id!}
        isOpen={isOpen}
        onClose={onClose}
        onDeleteItem={handleDeleteItem}
        deleting={fetching}
      />
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
