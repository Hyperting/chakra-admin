import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { CreatePageTitle } from './CreatePageTitle'
import { useCreate } from '../../core/details/useCreate'

export type CreateProps<TData = any, TVariables = OperationVariables> = {
  resource?: string
  titleComponent?: React.ReactNode
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>
  filtersComponent?: React.ReactNode
}

export const Create: FC<CreateProps> = (props) => {
  const { children, resource, titleComponent, mutation } = props
  const { onSubmit, executeMutation, mutationResult } = useCreate(props)

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
        {titleComponent || <CreatePageTitle label={`Create ${resource}`} />}
      </chakra.div>
      {Children.map(children, (child: any) => {
        return React.cloneElement(child, {
          ...{
            ...child.props,
            mutation,
            onSubmit,
            executeMutation,
            mutationResult,
          },
        })
      })}
    </chakra.div>
  )
}
