import React, { FC, useCallback } from 'react'
import { chakra, ChakraProps } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { deepMap } from '../../core/details/deep-map'
import { UseCreateResult } from '../../core/details/useCreate'
import { UseEditResult } from '../../core/details/useEdit'
import { ca } from '../../core/react/system'
import { CALayoutComponents } from '../../core/react/system-layout'
import { CancelButton } from '../buttons/CancelButton'
import { SubmitButton } from '../buttons/SubmitButton'
import { filterChakraProps } from '../../core/react/system-utils'

type BaseFormProps = {
  children?: React.ReactNode
  defaultValues?: any
  resource?: string
} & Partial<UseCreateResult | UseEditResult> &
  ChakraProps

export const BaseForm: FC<BaseFormProps> = ({
  children,
  defaultValues,
  onSubmit: onSubmitProp = () => {},
  mutationResult,
  executeMutation,
  ...rest
}) => {
  const methods = useForm({ defaultValues })
  const { handleSubmit } = methods

  const onSubmit = useCallback(
    (values) => {
      const { id: valuesId, __typename, ...rest } = values
      // const foundedFields = deepFilter(children, (child: any) => {
      //   if (child.props.source) {
      //     return true
      //   }

      //   return false
      // })
      //   ?.map((item) => item && (item as any)?.props && (item as any).props.source)
      //   ?.filter((item) => !!item)
      // console.log('values', foundedFields, values)
      // const finalData = foundedFields?.reduce((acc, item) => {
      //   return {
      //     ...acc,
      //     [item]: values[item],
      //   }
      // }, {})
      onSubmitProp(rest)
    },
    [onSubmitProp]
  )

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <chakra.div>
        {deepMap(children, (child: any, index) => {
          const isLayout =
            child?.type?.displayName &&
            Object.keys(CALayoutComponents).includes(child?.type?.displayName)

          if (isLayout) {
            return React.createElement(
              ca[child.type.displayName],
              {
                ...{
                  ...child.props,
                  // onSubmit,
                  executeMutation,
                  mutationResult,
                  register: methods.register,
                  unregister: methods.unregister,
                  control: methods.control,
                  ...filterChakraProps(rest),
                  key: `${child?.type?.displayName || 'FI'}-${index}`,
                },
              },
              child.props?.children
            )
          } else {
            const { ...restProps } = child.props
            return React.createElement(child.type, {
              ...{
                ...restProps,
                ...filterChakraProps(rest),
                register: methods.register,
                unregister: methods.unregister,
                control: methods.control,
                name: child.props.source,
                key: `${child?.type?.displayName || 'FI'}-${child.props.source}-${index}`,
              },
            })
            // return child.props.source
            //   ? React.createElement(child.type, {
            //       ...{
            //         ...restProps,
            //         register: methods.register,
            //         control: methods.control,
            //         name: child.props.source,
            //         key: child.props.source,
            //       },
            //     })
            //   : child
          }
        })}
      </chakra.div>
      <chakra.div>
        <SubmitButton
          disabled={mutationResult?.loading}
          isLoading={mutationResult?.loading}
          type="submit"
        />
        <CancelButton />
      </chakra.div>
    </chakra.form>
  )
}
