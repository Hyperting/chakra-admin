import React, { cloneElement, FC, ReactElement } from 'react'
import { DocumentNode } from 'graphql'
import { MutationResult, OperationVariables, TypedDocumentNode } from '@apollo/client'
import { useTranslate } from 'ca-i18n'
import { deepMap } from 'ca-system'
import { useCreate } from '../../core/details/useCreate'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { DetailsPageTitle } from './DetailsPageTitle'
import { PageLayout, PageLayoutProps } from './PageLayout'
import { useAdminStateValue, registeredIcons } from '../../core/admin/adminState'
import { NavigateBehavior } from '../../core'
import { Button, useToast } from '@chakra-ui/react'
// import { createStandaloneToast } from '@chakra-ui/react'

export type CreateProps<TData = any, TVariables = OperationVariables> = {
  resource?: string
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>
  filtersComponent?: React.ReactNode
  renderingInModal?: boolean
  layout?: ReactElement<PageLayoutProps, any>
  onSuccess?: ((data: MutationResult<TData>) => void) | ((data: MutationResult<TData>) => Promise<void>)
  redirect?: NavigateBehavior
  children?: React.ReactNode
} & Pick<PageLayoutProps, 'title'>

export const Create: FC<CreateProps> = (props) => {
  const {
    children,
    resource,
    renderingInModal,
    layout: Layout = <PageLayout />,
    title = <DetailsPageTitle />,
    mutation,
  } = props
  const { onSubmit, executeMutation, mutationResult, defaultValues } = useCreate(props)
  const { registeredResources, initialized } = useAdminStateValue()
  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()
  const toast = useToast()

  return cloneElement(
    Layout,
    {
      renderingInModal,
      title:
        typeof title === 'string'
          ? title
          : (React.cloneElement(title, {
              renderingInModal,
              label: t('ca.page.create', {
                smart_count: 1,
                name: resource ? getResourceLabel(resource, 1) : '',
              }),
              icon:
                resource &&
                registeredResources[resource]?.iconName &&
                registeredIcons[registeredResources[resource]?.iconName]
                  ? (registeredIcons[registeredResources[resource]?.iconName] as any)
                  : undefined,
            }) as any),
    },

    <>
      <Button
        onClick={() => {
          console.log('toast changed', toast)
          const id = toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          console.log('id', id)
        }}
      >
        Click me
      </Button>
      {deepMap(children, (child: any) => {
        return React.cloneElement(
          child,
          {
            ...{
              defaultValues,
              mutation,
              resource,
              onSubmit,
              executeMutation,
              mutationResult,
              renderingInModal,
              ...child.props,
            },
          },
          child.props?.children
        )
      })}
    </>
  )
}
