import React, { cloneElement, FC, isValidElement, useMemo } from 'react'
import { useTranslate } from 'ca-i18n'
import { deepMap } from '../../core/details/deep-map'
import { registeredIcons, useAdminStateValue } from '../../core/admin/adminState'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { ListProps } from '../../core/list/ListProps'
import { useList } from '../../core/list/useList'
import { PageLayout } from '../details/PageLayout'
import { PageTitle } from '../details/PageTitle'
import { ListToolbar } from './ListToolbar'
import { ca } from '../../core/react/system'
import { CALayoutComponents } from '../../core/react/system-layout'

export const List: FC<ListProps> = (props) => {
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
  const { registeredResources, initialized } = useAdminStateValue()

  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()

  const childrenProps = useMemo(
    () => ({
      resource,
      showMoreMenu,
      ...rest,
    }),
    [resource, rest, showMoreMenu]
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
          (toolbarComponent as any).props.children
        ),
    },
    <>
      {deepMap(children, (child: any) => {
        const isLayout = Object.keys(CALayoutComponents).includes(child.type.displayName)

        if (isLayout) {
          return React.createElement(
            ca[child.type.displayName],
            {
              ...child.props,
              ...childrenProps,
              ...listData,
              showMoreMenu,
            },
            child.props?.children
          )
        } else {
          return React.cloneElement(child, {
            ...{
              ...child.props,
              ...childrenProps,
              ...listData,
              showMoreMenu,
            },
          })
        }
      })}
    </>
  )
}
