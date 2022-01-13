import React, { Children, FC } from 'react'
import { Box, BoxProps, chakra } from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { deepMap } from 'react-children-utilities'
import { CreatePageTitle } from './CreatePageTitle'
import { useShow } from '../../core/details/useShow'
import { ca, ChakraLayoutComponents } from '../../core/react/system'

export type ShowProps<
  ItemTData = any,
  ItemTVariables = OperationVariables,
  EditTData = any,
  EditTVariables = OperationVariables
> = {
  resource?: string
  id?: string
  titleComponent?: React.ReactNode
  mutation?: DocumentNode | TypedDocumentNode<EditTData, EditTVariables>
  query: DocumentNode | TypedDocumentNode<ItemTData, ItemTVariables>
  filtersComponent?: React.ReactNode
}

const CABox = ca<BoxProps>(Box)

export const Show: FC<ShowProps> = (props) => {
  const { children, resource, titleComponent, mutation, id } = props
  const { onSubmit, executeMutation, mutationResult, loading, item, data, error } = useShow(props)

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
        {titleComponent || <CreatePageTitle label={`Show ${resource}`} />}
      </chakra.div>
      {loading ? (
        <>Loading</>
      ) : (
        deepMap(children, (child: any) => {
          const isLayout = ChakraLayoutComponents.includes(child.type.name)

          if (isLayout) {
            return React.createElement(
              ca[child.type.name],
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
