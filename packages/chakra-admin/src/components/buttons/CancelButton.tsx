import React, { FC, useCallback } from 'react'
import { useTranslate } from 'ca-i18n'
import { Path, useNavigate } from 'react-router-dom'
import { Button, ButtonProps } from '@chakra-ui/react'

type Props = {
  to?: string | Partial<Path>
} & ButtonProps

export const CancelButton: FC<Props> = ({ to, children, ...props }) => {
  const t = useTranslate()
  const navigate = useNavigate()
  const handleGoBack = useCallback(() => {
    // notes: for some   reason, Typescript complains with the following form: `navigate(to || -1)`.
    // So, for now we use the long if/else statement.
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }, [navigate, to])

  return (
    <Button onClick={handleGoBack} variant="outline" {...props}>
      {children || t('ca.action.cancel')}
    </Button>
  )
}
