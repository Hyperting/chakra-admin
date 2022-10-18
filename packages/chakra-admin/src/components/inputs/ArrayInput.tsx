import React, { FC } from 'react'
import { Stack, StackProps } from '@chakra-ui/react'
import { FieldValues, useFieldArray } from 'react-hook-form'
import { TreeRenderer } from '..'
import { filterChakraProps, CAInputProps } from 'ca-system'

export type ArrayInputProps<TItem extends FieldValues = Record<string, any>> = {
  emptyComponent?: React.ReactNode
  // rowComponent?: React.ReactNode
  topToolbar?: React.ReactNode
  bottomToolbar?: React.ReactNode
} & CAInputProps<TItem>

/**
 * WIP!
 */
export const ArrayInput: FC<ArrayInputProps> = React.forwardRef<any, ArrayInputProps>((props, ref) => {
  const {
    source,
    label,
    resource,
    required,
    min,
    max,
    maxLength,
    minLength,
    pattern,
    validate,
    valueAsNumber,
    valueAsDate,
    value,
    setValueAs,
    shouldUnregister,
    onChange,
    onBlur,
    disabled,
    deps,
    control,
    register,
    emptyComponent,
    children,
    rowComponent,
    toolbarComponent = null,
    ...rest
  } = props as ArrayInputProps & Record<string, any>

  const { append, fields, remove } = useFieldArray({
    name: source,
    control,
  })

  console.log(props, filterChakraProps(props), 'sono le props')

  return (
    <Stack ref={ref} {...rest}>
      {fields.length === 0 && emptyComponent}
      {fields.map((item, index) => {
        // return React.cloneElement(
        //   rowComponent as any,
        //   {
        //     key: item.id,
        //     remove,
        //   },
        //   [
        //     <TreeRenderer
        //       key={`${item.id}-0`}
        //       propsOverride={{ ...filterChakraProps(props), record: item }}
        //       children={children}
        //     />,
        //   ]
        // )
        return (
          <TreeRenderer
            key={item.id}
            propsOverride={{ ...filterChakraProps(props), record: item }}
            children={children}
          />
        )
      })}
    </Stack>
  )
})
