import React, { FC } from 'react'
import { Stack, StackProps } from '@chakra-ui/react'
import { TreeRenderer } from '..'
import { filterChakraProps } from '../../core/react/system-utils'

export type ArrayFieldProps<TItem = Record<string, any>> = {
  entries?: TItem[]
  emptyComponent?: React.ReactNode
} & StackProps

export const ArrayField: FC<ArrayFieldProps> = React.forwardRef<any, ArrayFieldProps>(
  ({ entries = [], children, emptyComponent, ...props }, ref) => {
    return (
      <Stack ref={ref} {...props}>
        {entries.length === 0 && emptyComponent}
        {entries.map((item, index) => {
          return (
            <TreeRenderer
              key={index}
              propsOverride={{ ...filterChakraProps(props), record: item }}
              children={children}
            />
          )
        })}
      </Stack>
    )
  }
)
