import { chakra } from '@chakra-ui/react'
import React, { Children, cloneElement, FC, isValidElement, useMemo } from 'react'
import { ListProps } from '../../core/list/ListProps'
import { useList } from '../../core/list/useList'
import { DataTable } from './DataTable'
import { PageTitle } from '../layout/PageTitle'
import { ListToolbar } from './ListToolbar'

export const List: FC<ListProps> = (props) => {
  const {
    titleComponent,
    toolbarComponent = <ListToolbar />,
    children,
    resource,
    showMoreMenu = true,
    ...rest
  } = props
  const listData = useList(props)

  const childrenProps = useMemo(
    () => ({
      resource,
      showMoreMenu,
      ...rest,
    }),
    [resource, rest, showMoreMenu]
  )

  return (
    <chakra.div>
      <chakra.div
        display="flex"
        w="100%"
        pt={{ base: 1, lg: '56px' }}
        pr={{ base: 5, lg: '64px' }}
        pb={5}
        pl={{ base: 5, lg: 0 }}
        justifyContent="space-between"
      >
        {titleComponent || <PageTitle label={resource} />}
        {isValidElement(toolbarComponent) &&
          cloneElement(
            toolbarComponent,
            {
              ...childrenProps,
              ...listData,
            },
            (toolbarComponent as any).props.children
          )}
      </chakra.div>
      {isValidElement(children) &&
        cloneElement(Children.only(children), {
          ...childrenProps,
          ...listData,
          showMoreMenu,
        } as any)}
    </chakra.div>
  )
}
