import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { deepMap } from 'react-children-utilities'
import { useTranslate } from 'ca-i18n'
import { CreatePageTitle } from './CreatePageTitle'
import { useCreate } from '../../core/details/useCreate'
import { ca, ChakraLayoutComponents } from '../../core/react/system'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'

export type CreateProps<TData = any, TVariables = OperationVariables> = {
  resource?: string
  titleComponent?: React.ReactNode
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>
  filtersComponent?: React.ReactNode
}

export const Create: FC<CreateProps> = (props) => {
  const { children, resource, titleComponent, mutation } = props
  const { onSubmit, executeMutation, mutationResult } = useCreate(props)
  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()

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
        {titleComponent || (
          <CreatePageTitle
            label={t('ca.actions.create', { count: 1, resource: getResourceLabel(resource, 1) })}
          />
        )}
      </chakra.div>
      {deepMap(children, (child: any) => {
        const isLayout = ChakraLayoutComponents.includes(child.type.displayName)

        if (isLayout) {
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
