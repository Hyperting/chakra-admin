import React, { cloneElement, FC, ReactElement } from 'react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
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
  const { onSubmit, executeMutation, mutationResult } = useCreate(props)
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
        // const isLayout = Object.values(CUILayoutComponents).includes((child as any)?.type as any)

        // if (isLayout) {
        //   return React.createElement(
        //     ca[child.type.displayName],
        //     {
        //       ...child.props,
        //       mutation,
        //       resource,
        //       onSubmit,
        //       executeMutation,
        //       mutationResult,
        //     },
        //     child.props?.children
        //   )
        // } else {
        return React.cloneElement(
          child,
          {
            ...{
              ...child.props,
              mutation,
              resource,
              onSubmit,
              executeMutation,
              mutationResult,
            },
          },
          child.props?.children
        )
        // }
      })}
    </>
  )
}
