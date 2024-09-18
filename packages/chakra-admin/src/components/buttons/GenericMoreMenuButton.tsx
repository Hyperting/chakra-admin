import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  IconButton,
  Portal,
  ButtonProps,
  MenuButtonProps,
  MenuDivider,
} from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { DocumentNode } from 'graphql'
import React, { FC, useCallback } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { RouteAvailability } from '../../core/admin/RouteAvailability'
import { useDeleteWithConfirm } from '../../core/details/useDeleteWithConfirm'
import { DeleteModal } from '../modal'

export type GenericMoreMenuButtonProps<Data = any, Variables = OperationVariables> = {
  deleteItemMutation?: DocumentNode | TypedDocumentNode<Data, Variables>
  onDelete?: ((id: string) => void) | ((id: string) => Promise<void>)
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
  children?: React.ReactNode
} & RouteAvailability &
  MenuButtonProps

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
  children,
  ...props
}) => {
  const { deleting, onDeleteItem, isOpen, onClose, onOpen } = useDeleteWithConfirm({
    deleteItemMutation,
    onDelete,
    onDeleteCompleted,
  })
  const t = useTranslate()
  const location = useLocation()

  const handleMenuItemDeleteClick = useCallback(() => {
    if (showConfirmDialogOnDelete) {
      onOpen()
    } else {
      onDeleteItem(id!)
    }
  }, [onDeleteItem, id, onOpen, showConfirmDialogOnDelete])

  const hasChildren = React.Children.count(children) > 0

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
          borderRadius="full"
          fontSize="md"
          minW="22px"
          w="22px"
          h="22px"
          {...props}
        />
        <Portal>
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

            {hasChildren && <MenuDivider />}

            {React.Children.map(children, (child) => {
              return React.cloneElement(child as React.ReactElement<ButtonProps>, {
                onClick: (event) => {
                  onClose()
                  ;(child as React.ReactElement<ButtonProps>).props.onClick?.(event)
                },
              })
            })}

            {hasChildren && <MenuDivider />}

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
        </Portal>
      </Menu>

      <DeleteModal
        resource={resource!}
        id={id!}
        isOpen={isOpen}
        onClose={onClose}
        onDeleteItem={onDeleteItem}
        deleting={deleting}
      />
    </>
  )
}
