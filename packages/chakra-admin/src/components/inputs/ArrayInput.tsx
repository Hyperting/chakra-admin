import React, { FC } from 'react'
import { Stack, StackProps } from '@chakra-ui/react'
import { useFieldArray } from 'react-hook-form'
import { TreeRenderer } from '..'
import { filterChakraProps } from '../../core/react/system-utils'
import { InputProps } from '../..'
import { CAInputProps } from '../../core/react/system-form'

export type ArrayInputProps<TItem = Record<string, any>> = {
  emptyComponent?: React.ReactNode
  rowComponent?: React.ReactNode
} & CAInputProps<TItem>

export const ArrayInput: FC<ArrayInputProps> = React.forwardRef<any, ArrayInputProps>(
  (props, ref) => {
    const {
      // source,
      // label,
      // resource,
      // required,
      // min,
      // max,
      // maxLength,
      // minLength,
      // pattern,
      // validate,
      // valueAsNumber,
      // valueAsDate,
      // value,
      // setValueAs,
      // shouldUnregister,
      // onChange,
      // onBlur,
      // disabled,
      // deps,
      // control,
      // register,
      // emptyComponent,
      // children,
      // rowComponent,
      ...rest
    } = props as ArrayInputProps & Record<string, any>

    // const { append, fields, remove } = useFieldArray({
    //   name: source,
    //   control,
    // })

    console.log(props, filterChakraProps(props), 'sono le props')

    return <div>ciao</div>

    // return (
    //   <Stack ref={ref}>
    //     {fields.length === 0 && emptyComponent}
    //     {fields.map((item, index) => {
    //       return React.cloneElement(
    //         rowComponent as any,
    //         {
    //           key: item.id,
    //         },
    //         [
    //           <TreeRenderer
    //             key={`${item.id}-0`}
    //             propsOverride={{ ...filterChakraProps(props), record: item }}
    //             children={children}
    //           />,
    //         ]
    //       )
    //       // (
    //       //   <TreeRenderer
    //       //     key={item.id}
    //       //     propsOverride={{ ...filterChakraProps(props), record: item }}
    //       //     children={children}
    //       //   />
    //       // )
    //     })}
    //   </Stack>
    // )
  }
)
