import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { deepMap } from 'react-children-utilities'
import { CreatePageTitle } from './CreatePageTitle'
import { useEdit } from '../../core/details/useEdit'
import { ChakraLayoutComponents } from '../../core/react'
import { ca } from '../../core/react/system'

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
  const { onSubmit, executeMutation, mutationResult, loading, item, data, error } = useEdit(props)

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
        deepMap(children, (child: any) => {
          const isLayout = ChakraLayoutComponents.includes(child.type.displayName)

          if (isLayout) {
            return React.createElement(
              ca[child.type.displayName],
              {
                ...{
                  ...child.props,
                  id,
                  mutation,
                  onSubmit,
                  executeMutation,
                  mutationResult,
                  defaultValues: item,
                  record: item,
                  loading,
                  data,
                  error,
                },
              },
              child.props?.children
            )
          } else {
            return React.cloneElement(child, {
              id,
              mutation,
              onSubmit,
              executeMutation,
              mutationResult,
              defaultValues: item,
              record: item,
              loading,
              data,
              error,
            })
          }
        })
      )}
    </chakra.div>
  )
}
