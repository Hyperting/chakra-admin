import React, { cloneElement, FC, ReactElement } from 'react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { useTranslate } from 'ca-i18n'
import { deepMap } from '../../core/details/deep-map'
import { useEdit } from '../../core/details/useEdit'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { DetailsPageTitle } from './DetailsPageTitle'
import { PageLayout, PageLayoutProps } from './PageLayout'
import { useAdminStateValue, registeredIcons } from '../../core/admin/adminState'
import { TreeRenderer } from './TreeRenderer'

export type EditProps<
  ItemTData = any,
  ItemTVariables = OperationVariables,
  EditTData = any,
  EditTVariables = OperationVariables
> = {
  resource?: string
  id?: string
  mutation: DocumentNode | TypedDocumentNode<EditTData, EditTVariables>
  query: DocumentNode | TypedDocumentNode<ItemTData, ItemTVariables>
  filtersComponent?: React.ReactNode
  renderingInModal?: boolean
  layout?: ReactElement<PageLayoutProps, any>
} & Pick<PageLayoutProps, 'title'>

export const Edit: FC<EditProps> = (props) => {
  const {
    children,
    resource,
    mutation,
    renderingInModal,
    layout: Layout = <PageLayout />,
    title = <DetailsPageTitle />,
    id,
  } = props
  const { onSubmit, executeMutation, mutationResult, loading, item, data, error } = useEdit(props)
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
              label: t('ca.page.edit', {
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
            }) as any),
    },
    <>
      {loading ? (
        <>Loading</>
      ) : (
        <TreeRenderer
          children={children}
          propsOverride={{
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
          }}
        />
        // deepMap(children, (child: any) => {
        //   // const isLayout = Object.values(CUILayoutComponents).includes((child as any)?.type as any)

        //   // if (isLayout) {
        //   //   return React.createElement(
        //   //     ca[child.type.displayName],
        //   //     {
        //   //       ...{
        //   //         ...child.props,
        //   //         id,
        //   //         resource,
        //   //         mutation,
        //   //         onSubmit,
        //   //         executeMutation,
        //   //         mutationResult,
        //   //         defaultValues: item,
        //   //         record: item,
        //   //         loading,
        //   //         data,
        //   //         error,
        //   //       },
        //   //     },
        //   //     child.props?.children
        //   //   )
        //   // } else {
        //   return React.cloneElement(
        //     child,
        //     {
        //       id,
        //       resource,
        //       mutation,
        //       onSubmit,
        //       executeMutation,
        //       renderingInModal,
        //       mutationResult,
        //       defaultValues: item,
        //       record: item,
        //       loading,
        //       data,
        //       error,
        //     },
        //     child.props?.children
        //   )
        //   // }
        // })
      )}
    </>
  )
}
