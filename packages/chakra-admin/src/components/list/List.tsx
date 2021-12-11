import { chakra } from '@chakra-ui/react'
import React, { cloneElement, FC, isValidElement, useMemo } from 'react'
import { ListProps } from '../../core/list/ListProps'
import { useList } from '../../core/list/useList'
import { DataTable } from './DataTable'
import { PageTitle } from '../layout/PageTitle'
import { ListToolbar } from './ListToolbar'

export const List: FC<ListProps> = (props) => {
  const {
    titleComponent,
    toolbarComponent = <ListToolbar />,
    listComponent = <DataTable />,
    resource,
    showMoreMenu = true,
  } = props
  const listData = useList(props)

  const childrenProps = useMemo(
    () => ({
      resource,
      showMoreMenu,
      ...props,
    }),
    [props, resource, showMoreMenu]
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
      {isValidElement(listComponent) &&
        cloneElement(listComponent, {
          ...childrenProps,
          ...listData,
          showMoreMenu,
        } as any)}
    </chakra.div>
  )
}
