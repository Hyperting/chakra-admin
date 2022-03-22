import { useCallback, useState } from 'react'
import { useDisclosure, UseDisclosureReturn, useToast } from '@chakra-ui/react'
import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  useApolloClient,
} from '@apollo/client'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'
import { useVersion } from '../admin/versionState'

type UseDeleteWithConfirmOptions<Data = any, Variables = OperationVariables> = {
  onDelete?: ((id: string) => void) | ((id: string) => Promise<void>)
  deleteItemMutation?: DocumentNode | TypedDocumentNode<Data, Variables>
  onDeleteCompleted?: () => void
}

type UseDeleteWithConfirmReturn = {
  deleting: boolean
  onDeleteItem: (id: string) => Promise<void>
} & UseDisclosureReturn

export function useDeleteWithConfirm(
  options: UseDeleteWithConfirmOptions
): UseDeleteWithConfirmReturn {
  const { onDelete, deleteItemMutation, onDeleteCompleted } = options
  const disclosureProps = useDisclosure()
  const strategy = useGlobalStrategy()
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()
  const client = useApolloClient()
  const nextVersion = useVersion()

  const onDeleteItem = useCallback(
    async (id: string) => {
      if (onDelete) {
        await onDelete(id!)
        nextVersion()
        if (onDeleteCompleted) {
          onDeleteCompleted()
        }
      } else {
        try {
          const variables = strategy?.delete.getVariables(id!)
          if (!variables) {
            throw new Error('Variables not found in DeleteStrategy.getVariables()')
          }

          setDeleting(true)
          const result = await client.mutate({
            mutation: deleteItemMutation!,
            variables,
          })
          if (result.errors && result.errors.length > 0) {
            throw new Error(`Error deleting resource with id:${id}`)
          } else {
            toast({
              status: 'success',
              title: 'Risorsa eliminata correttamente',
              isClosable: true,
            })
            disclosureProps.onClose()
            nextVersion()
            if (onDeleteCompleted) {
              onDeleteCompleted()
            }
          }
        } catch (error) {
          console.error('Error during delete', error)
          toast({
            status: 'error',
            position: 'top',
            isClosable: true,
            title: 'Errore!',
            // eslint-disable-next-line @typescript-eslint/quotes
            description:
              "C'è stato un problema con l'eliminazione della risorsa, riprova più tardi.",
          })
        } finally {
          setDeleting(false)
        }
      }
    },
    [
      client,
      deleteItemMutation,
      disclosureProps,
      onDelete,
      onDeleteCompleted,
      strategy?.delete,
      toast,
    ]
  )

  return {
    ...disclosureProps,
    onDeleteItem,
    deleting,
  }
}
