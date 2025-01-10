import React, { cloneElement, isValidElement, useMemo } from 'react'
import { useTranslate } from 'ca-i18n'
import { registeredIcons, useAdminStateValue } from '../../core/admin/adminState'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { ListProps } from '../../core/list/ListProps'
import { useList } from '../../core/list/useList'
import { PageLayout } from '../details/PageLayout'
import { PageTitle } from '../details/PageTitle'
import { ListToolbar } from './ListToolbar'
import { TreeRenderer } from '../details/TreeRenderer'

export function List<TQuery = Record<string, any>, TItem extends Record<string, any> = Record<string, any>>(
  props: ListProps<TQuery, TItem>,
) {
  const {
    title = <PageTitle />,
    toolbarComponent = <ListToolbar />,
    children,
    resource,
    showMoreMenu = true,
    layout: Layout = <PageLayout />,
    ...rest
  } = props
  const listData = useList(props)
  const { registeredResources } = useAdminStateValue()

  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()

  const childrenProps = useMemo(
    () => ({
      resource,
      showMoreMenu,
      ...rest,
    }),
    [resource, rest, showMoreMenu],
  )

  return cloneElement(
    Layout,
    {
      title:
        typeof title === 'string'
          ? title
          : (React.cloneElement(title, {
              label: t('ca.page.list', {
                smart_count: 1,
                name: resource ? getResourceLabel(resource, 2) : '',
              }),
              icon:
                resource &&
                registeredResources[resource]?.iconName &&
                registeredIcons[registeredResources[resource]?.iconName]
                  ? (registeredIcons[registeredResources[resource]?.iconName] as any)
                  : undefined,
            }) as any),
      topToolbar:
        isValidElement(toolbarComponent) &&
        cloneElement(
          toolbarComponent,
          {
            ...childrenProps,
            ...listData,
          },
          (toolbarComponent as any).props.children,
        ),
    },
    <TreeRenderer
      propsOverride={{
        ...childrenProps,
        ...listData,
        showMoreMenu,
      }}
      children={children}
    />,
  )
}

List.displayName = 'CAList'
