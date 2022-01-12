import { Button, chakra } from '@chakra-ui/react'
import React, { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { UseCreateResult } from '../../core/details/useCreate'
import { UseEditResult } from '../../core/details/useEdit'

type Props = {
  children?: React.ReactNode
  defaultValues?: any
} & Partial<UseCreateResult | UseEditResult>

export const BaseForm: FC<Props> = ({
  children,
  defaultValues,
  onSubmit: onSubmitProp = () => {},
  mutationResult,
}) => {
  const navigate = useNavigate()
  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])
  const methods = useForm({ defaultValues })
  const { handleSubmit } = methods

  const onSubmit = useCallback(
    (values) => {
      const foundedFields = React.Children.map(children, (child: any) => {
        if (child.props.source) {
          return child.props.source
        }

        return undefined
      })?.filter((item) => !!item)

      const finalData = foundedFields?.reduce((acc, item) => {
        return {
          ...acc,
          [item]: values[item],
        }
      }, {})
      onSubmitProp(finalData)
    },
    [children, onSubmitProp]
  )

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <chakra.div>
        {React.Children.map(children, (child: any) => {
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
