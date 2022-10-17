import React, { Children, FC } from 'react'
import { chakra } from '@chakra-ui/react'
import { EditButton } from '../buttons/EditButton'
import { ShowProps } from './Show'

type Props = Partial<ShowProps>

export const ShowToolbar: FC<Props> = ({ children, ...rest }) => {
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

  return <chakra.div>{children || <EditButton {...rest} />}</chakra.div>
}
