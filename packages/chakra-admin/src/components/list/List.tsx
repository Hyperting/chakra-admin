import React, { cloneElement, FC, isValidElement, useMemo } from 'react'
import { chakra } from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { deepMap } from 'react-children-utilities'
import { registeredIcons, useAdminStateValue } from '../../core/admin/adminState'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { ListProps } from '../../core/list/ListProps'
import { useList } from '../../core/list/useList'
import { PageContent } from '../details/PageContent'
import { PageTitle } from '../details/PageTitle'
import { ListToolbar } from './ListToolbar'
import { ca, ChakraLayoutComponents } from '../../core/react/system'

export const List: FC<ListProps> = (props) => {
  const {
    title = <PageTitle />,
    toolbarComponent = <ListToolbar />,
    children,
    resource,
    showMoreMenu = true,
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

  return (
    <PageContent
      title={
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
            }) as any)
      }
      topToolbar={
        isValidElement(toolbarComponent) &&
        cloneElement(
          toolbarComponent,
          {
            ...childrenProps,
            ...listData,
          },
          (toolbarComponent as any).props.children
        )
      }
    >
      {/* {isValidElement(children) &&
        cloneElement(Children.only(children), {
          ...childrenProps,
          ...listData,
          showMoreMenu,
        } as any)} */}

      {deepMap(children, (child: any) => {
        const isLayout = ChakraLayoutComponents.includes(child.type.displayName)

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
    </PageContent>
  )
}
