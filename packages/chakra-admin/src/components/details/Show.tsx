import React, { FC } from 'react'
import { DocumentNode } from 'graphql'
import { OperationVariables, TypedDocumentNode } from '@apollo/client'
import { useTranslate } from 'ca-i18n'
import { deepMap } from '../../core/details/deep-map'
import { useShow } from '../../core/details/useShow'
import { ca } from '../../core/react/system'
import { CALayoutComponents } from '../../core/react/system-layout'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { DetailsPageTitle } from './DetailsPageTitle'
import { PageContent, PageContentProps } from './PageContent'
import { useAdminStateValue, registeredIcons } from '../../core/admin/adminState'

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
  filtersComponent?: React.ReactNode
  renderingInModal?: boolean
} & Pick<PageContentProps, 'title'>

export const Show: FC<ShowProps> = (props) => {
  const { children, resource, mutation, renderingInModal, title = <DetailsPageTitle />, id } = props
  const { onSubmit, executeMutation, mutationResult, loading, item, data, error } = useShow(props)
  const { registeredResources, initialized } = useAdminStateValue()
  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()

  return (
    <PageContent
      renderingInModal={renderingInModal}
      title={
        typeof title === 'string'
          ? title
          : (React.cloneElement(title, {
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
            }) as any)
      }
    >
      {loading ? (
        <>Loading</>
      ) : (
        deepMap(children, (child: any) => {
          const isLayout = Object.keys(CALayoutComponents).includes(child.type.displayName)

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
                  resource,
                  data,
                  error,
                  ref: (props as any).ref,
                },
              },
              child.props?.children
            )
          } else {
            return React.cloneElement(child, {
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
            })
          }
        })
      )}
    </PageContent>
  )
}
