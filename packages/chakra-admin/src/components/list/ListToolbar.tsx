import React, { Children, FC } from 'react'
import { chakra, Stack } from '@chakra-ui/react'
import { CreateButton } from '../buttons/CreateButton'
import { ListProps } from '../../core/list/ListProps'

type Props = Partial<ListProps>

export const ListToolbar: FC<Props> = ({ children, ...rest }) => {
  if (Children.count(children) > 0) {
    return (
      <Stack isInline>
        {Children.map(children, (child: any) => {
          const { ...restProps } = child.props
          return React.createElement(child.type, {
            ...{
              ...rest,
              ...restProps,
            },
          })
        })}
      </Stack>
    )
  }

  return <chakra.div>{children || <CreateButton {...rest} />}</chakra.div>
}
