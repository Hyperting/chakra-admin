import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { deepMap } from 'react-children-utilities'
import { CreatePageTitle } from './CreatePageTitle'
import { useCreate } from '../../core/details/useCreate'
import { ca, ChakraLayoutComponents } from '../../core/react/system'

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
      {deepMap(children, (child: any) => {
        const isLayout = ChakraLayoutComponents.includes(child.type.displayName)

        if (isLayout) {
          console.log('sono un layout', child.type.name, child.type.displayName)
          return React.createElement(
            ca[child.type.displayName],
            {
              ...child.props,
              mutation,
              onSubmit,
              executeMutation,
              mutationResult,
            },
            child.props?.children
          )
        } else {
          console.log('NON sono un layout', child.type.name, child.type.displayName)
          return React.cloneElement(child, {
            ...{
              ...child.props,
              mutation,
              onSubmit,
              executeMutation,
              mutationResult,
            },
          })
        }
      })}
    </chakra.div>
  )
}
