import React, { FC } from 'react'
import { deepMap } from '../../core/details/deep-map'

type Props = {
  propsOverride: any
}

export const TreeRenderer: FC<Props> = ({ children, propsOverride }) => {
  return (
    <>
      {deepMap(children, (child: any) => {
        return React.cloneElement(
          child,
          {
            ...(propsOverride || {}),
            ...((child as any).props || {}), // <-- we want to maintain the original props, otherwise we will lose the ability to override children
          },
          child.props?.children
        )
      })}
    </>
  )
}
