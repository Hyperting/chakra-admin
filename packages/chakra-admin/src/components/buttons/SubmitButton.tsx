import React, { FC } from 'react'
import { useTranslate } from 'ca-i18n'
import { Button, ButtonProps } from '@chakra-ui/react'

type SubmitButtonProps = {
  label?: string
} & ButtonProps

export const SubmitButton: FC<SubmitButtonProps> = ({ label, children, ...props }) => {
  const t = useTranslate()

  return (
    <Button type="submit" color="white" textStyle="description" fontWeight="600" {...props}>
      {children || t('ca.action.submit')}
    </Button>
  )
}
