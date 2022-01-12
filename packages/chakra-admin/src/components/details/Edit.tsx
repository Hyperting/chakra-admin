import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { CreatePageTitle } from './CreatePageTitle'
import { useEdit } from '../../core/details/useEdit'

export type EditProps<
  ItemTData = any,
  ItemTVariables = OperationVariables,
  EditTData = any,
  EditTVariables = OperationVariables
> = {
  resource?: string
  id?: string
  titleComponent?: React.ReactNode
  mutation: DocumentNode | TypedDocumentNode<EditTData, EditTVariables>
  query: DocumentNode | TypedDocumentNode<ItemTData, ItemTVariables>
  filtersComponent?: React.ReactNode
}

export const Edit: FC<EditProps> = (props) => {
  const { children, resource, titleComponent, mutation, id } = props
  const { onSubmit, executeMutation, mutationResult, loading, data, error } = useEdit(props)

  return (
    <chakra.div>
      <chakra.div
        display="flex"
        w="100%"
        pt={{ base: 0, lg: '56px' }}
        pr={{ base: 5, lg: '64px' }}
        pb={5}
        pl={{ base: 5, lg: 0 }}
        justifyContent="space-between"
      >
        {titleComponent || <CreatePageTitle label={`Edit ${resource}`} />}
      </chakra.div>
      {loading ? (
        <>Loading</>
      ) : (
        Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            ...{
              ...child.props,
              id,
              mutation,
              onSubmit,
              executeMutation,
              mutationResult,
              defaultValues:
                data && Object.keys(data).length > 0
                  ? (data as any)[Object.keys(data)[0]]
                  : undefined,
            },
          })
        })
      )}
    </chakra.div>
  )
}
