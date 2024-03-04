import React, { FC, useCallback } from 'react'
import { chakra, ChakraProps, Box, ModalBody, ModalFooter } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { UseCreateResult } from '../../core/details/useCreate'
import { UseEditResult } from '../../core/details/useEdit'
import { CancelButton } from '../buttons/CancelButton'
import { SubmitButton } from '../buttons/SubmitButton'
import { filterChakraProps } from 'ca-system'
import { TreeRenderer } from '../details/TreeRenderer'

type BaseFormProps = {
  children?: React.ReactNode
  defaultValues?: any
  resource?: string
  renderingInModal?: boolean
} & Partial<UseCreateResult | UseEditResult> &
  ChakraProps

export const BaseForm: FC<BaseFormProps> = ({
  children,
  defaultValues,
  onSubmit: onSubmitProp = () => {},
  mutationResult,
  executeMutation,
  resource,
  renderingInModal,
  ...rest
}) => {
  const methods = useForm({ defaultValues })
  const { handleSubmit } = methods

  const onSubmit = useCallback(
    (values: any) => {
      onSubmitProp({ __typename: resource, ...values })
    },
    [onSubmitProp, resource],
  )

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <BaseFormBody renderingInModal={renderingInModal}>
        <TreeRenderer
          children={children}
          propsOverride={{
            ...filterChakraProps(rest),
            setValue: methods.setValue,
            register: methods.register,
            unregister: methods.unregister,
            control: methods.control,
            resource,
          }}
        />
      </BaseFormBody>

      <BaseFormFooter renderingInModal={renderingInModal}>
        <chakra.div display="flex" justifyContent="end">
          <CancelButton />
          <SubmitButton
            disabled={mutationResult?.loading}
            isLoading={mutationResult?.loading}
            type="submit"
            bg="gray.700"
            _hover={{ bg: 'gray.500' }}
            ml={5}
          />
        </chakra.div>
      </BaseFormFooter>
    </chakra.form>
  )
}

export type BaseFormPartProps = {
  children: React.ReactNode
  renderingInModal?: boolean
}

function BaseFormBody({ children, renderingInModal }: BaseFormPartProps) {
  if (renderingInModal) {
    return <ModalBody>{children}</ModalBody>
  }

  return <Box>{children}</Box>
}

function BaseFormFooter({ renderingInModal, children }: BaseFormPartProps) {
  if (renderingInModal) {
    return <ModalFooter>{children}</ModalFooter>
  }

  return (
    <Box zIndex="1" bottom="0px" w="100%" right="0px">
      {children}
    </Box>
  )
}
