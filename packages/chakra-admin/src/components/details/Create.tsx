import React, { cloneElement, FC, ReactElement } from 'react'
import { DocumentNode } from 'graphql'
import { MutationResult, OperationVariables, TypedDocumentNode } from '@apollo/client'
import { useTranslate } from 'ca-i18n'
import { deepMap } from '../../core/details/deep-map'
import { useCreate } from '../../core/details/useCreate'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { DetailsPageTitle } from './DetailsPageTitle'
import { PageLayout, PageLayoutProps } from './PageLayout'
import { useAdminStateValue, registeredIcons } from '../../core/admin/adminState'

export type CreateProps<TData = any, TVariables = OperationVariables> = {
  resource?: string
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>
  filtersComponent?: React.ReactNode
  renderingInModal?: boolean
  layout?: ReactElement<PageLayoutProps, any>
  redirect?: boolean | string | ((data: any) => string)
  onSuccess?:
    | ((data: MutationResult<TData>) => void)
    | ((data: MutationResult<TData>) => Promise<void>)
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
