import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { CreateButton } from '../buttons/CreateButton'
import { ListProps } from '../../core/list/ListProps'

type Props = Partial<ListProps>

export const ListToolbar: FC<Props> = ({ children, ...rest }) => {
  if (Children.count(children) > 0) {
    return (
      <>
        {Children.map(children, (child: any) => {
          const { children, ...restProps } = child.props
          return React.createElement(child.type, {
            ...{
              ...rest,
              ...restProps,
            },
          })
        })}
      </>
    )
  }

  return <chakra.div>{children || <CreateButton {...rest} />}</chakra.div>
}
