import React, { FC } from 'react'
import { Stack, StackProps } from '@chakra-ui/react'
import { TreeRenderer } from '..'
import { filterChakraProps } from '../../core/react/system-utils'

export type ArrayFieldProps<TItem = Record<string, any>> = {
  entries?: TItem[]
} & StackProps

export const ArrayField: FC<ArrayFieldProps> = React.forwardRef<any, ArrayFieldProps>(
  ({ entries = [], children, ...props }, ref) => {
    return (
      <Stack ref={ref} {...props}>
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
