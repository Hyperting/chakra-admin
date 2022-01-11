import { Button, Icon } from '@chakra-ui/react'
import React, { FC, useCallback } from 'react'
import { HiArrowNarrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { PageTitle, PageTitleProps } from '../layout/PageTitle'
import { ShadowedBox } from '../layout/ShadowedBox'

type Props = PageTitleProps & {
  disableGoBack?: boolean
}

export const CreatePageTitle: FC<Props> = ({ disableGoBack, ...props }) => {
  const navigate = useNavigate()
  const handleBackClick = useCallback(() => {
    if (disableGoBack) {
      return
    }
    navigate(-1)
  }, [disableGoBack, navigate])

  return (
    <PageTitle
      boxComponent={
        <ShadowedBox as={Button} onClick={handleBackClick} variant="outlined">
          <Icon as={props.icon || HiArrowNarrowLeft} fontSize="2xl" />
        </ShadowedBox>
      }
      {...props}
    />
  )
}
