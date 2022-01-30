import React, { cloneElement, FC, isValidElement, ReactElement } from 'react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { useTranslate } from 'ca-i18n'
import { deepMap } from '../../core/details/deep-map'
import { useShow } from '../../core/details/useShow'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { DetailsPageTitle } from './DetailsPageTitle'
import { PageLayout, PageLayoutProps } from './PageLayout'
import { useAdminStateValue, registeredIcons } from '../../core/admin/adminState'
import { ShowToolbar } from './ShowToolbar'

export type ShowProps<
  ItemTData = any,
  ItemTVariables = OperationVariables,
  EditTData = any,
  EditTVariables = OperationVariables
> = {
  resource?: string
  id?: string
  mutation?: DocumentNode | TypedDocumentNode<EditTData, EditTVariables>
  query: DocumentNode | TypedDocumentNode<ItemTData, ItemTVariables>
  renderingInModal?: boolean
  layout?: ReactElement<PageLayoutProps, any>
  toolbarComponent?: React.ReactNode
} & Pick<PageLayoutProps, 'title'>

export const Show: FC<ShowProps> = (props) => {
  const {
    children,
    resource,
    mutation,
    renderingInModal,
    layout: Layout = <PageLayout />,
    title = <DetailsPageTitle />,
    toolbarComponent = <ShowToolbar />,
    id,
  } = props
  const { onSubmit, executeMutation, mutationResult, loading, item, data, error } = useShow(props)
  const { registeredResources, initialized } = useAdminStateValue()
  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()

  return cloneElement(
    Layout,
    {
      loading,
      resource,
      data,
      error,
      record: item,
      renderingInModal,
      id,
      title:
        typeof title === 'string'
          ? title
          : title
          ? (React.cloneElement(title, {
              renderingInModal,
              label: t('ca.page.show', {
                smart_count: 1,
                name: resource ? getResourceLabel(resource, 1) : '',
                id,
              }),
              icon:
                resource &&
                registeredResources[resource]?.iconName &&
                registeredIcons[registeredResources[resource]?.iconName]
                  ? (registeredIcons[registeredResources[resource]?.iconName] as any)
                  : undefined,
              loading,
              resource,
              data,
              error,
              record: item,
              id,
            }) as any)
          : undefined,
      topToolbar:
        isValidElement(toolbarComponent) &&
        cloneElement(
          toolbarComponent,
          {
            loading,
            resource,
            data,
            error,
            record: item,
            renderingInModal,
            id,
          } as any,
          (toolbarComponent as any).props.children
        ),
    },
    <>
      {loading ? (
        <>Loading</>
      ) : (
        deepMap(children, (child: any) => {
          // const isLayout = Object.values(CUILayoutComponents).includes((child as any)?.type as any)

          // if (isLayout) {
          //   return React.createElement(
          //     ca[child.type.displayName],
          //     {
          //       ...{
          //         id,
          //         mutation,
          //         onSubmit,
          //         executeMutation,
          //         mutationResult,
          //         defaultValues: item,
          //         record: item,
          //         loading,
          //         resource,
          //         data,
          //         error,
          //         ...child.props,
          //       },
          //     },
          //     child.props?.children
          //   )
          // } else {
          return React.cloneElement(
            child,
            {
              id,
              onSubmit,
              mutation,
              executeMutation,
              mutationResult,
              defaultValues: item,
              record: item,
              loading,
              resource,
              data,
              error,
              ...((child as any).props || {}),
            },
            child.props?.children
          )
          // }
        })
      )}
    </>
  )
}
