import React, { FC } from 'react'
import { useTranslate } from 'ca-i18n'
import { Button, ButtonProps, Text } from '@chakra-ui/react'

type SubmitButtonProps = {
  label?: string
} & ButtonProps

export const SubmitButton: FC<SubmitButtonProps> = ({ label, children, ...props }) => {
  const t = useTranslate()

  return (
    <Button type="submit" {...props}>
      <Text color="white" textStyle="description" fontWeight="600">
        {children || t('ca.action.submit')}
      </Text>
    </Button>
  )
}
