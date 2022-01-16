import { Button, chakra, ChakraProps } from '@chakra-ui/react'
import React, { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { deepMap } from 'react-children-utilities'
import { UseCreateResult } from '../../core/details/useCreate'
import { UseEditResult } from '../../core/details/useEdit'
import { ca, ChakraLayoutComponents } from '../../core/react/system'

type BaseFormProps = {
  children?: React.ReactNode
  defaultValues?: any
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
  const navigate = useNavigate()
  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])
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
        {deepMap(children, (child: any) => {
          const isLayout = ChakraLayoutComponents.includes(child.type.displayName)

          if (isLayout) {
            return React.createElement(
              ca[child.type.displayName],
              {
                ...{
                  ...child.props,
                  onSubmit,
                  executeMutation,
                  mutationResult,
                  ...rest,
                },
              },
              child.props?.children
            )
          } else {
            const { children, ...restProps } = child.props
            return child.props.source
              ? React.createElement(child.type, {
                  ...{
                    ...restProps,
                    register: methods.register,
                    control: methods.control,
                    name: child.props.source,
                    key: child.props.source,
                  },
                })
              : child
          }
        })}
      </chakra.div>
      <chakra.div>
        <Button
          disabled={mutationResult?.loading}
          isLoading={mutationResult?.loading}
          type="submit"
          colorScheme="red"
        >
          Crea
        </Button>
        <Button onClick={handleGoBack} variant="outline">
          Annulla
        </Button>
      </chakra.div>
    </chakra.form>
  )
}
