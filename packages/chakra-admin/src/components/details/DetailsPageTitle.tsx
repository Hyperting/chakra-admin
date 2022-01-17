import { Button, Icon } from '@chakra-ui/react'
import React, { FC, useCallback } from 'react'
import { HiArrowNarrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { PageTitle, PageTitleProps } from './PageTitle'
import { ShadowedBox } from '../layout/ShadowedBox'

type Props = PageTitleProps & {
  disableGoBack?: boolean
}

export const DetailsPageTitle: FC<Props> = ({ disableGoBack, renderingInModal, ...props }) => {
  const navigate = useNavigate()
  const handleBackClick = useCallback(() => {
    if (disableGoBack) {
      return
    }
    navigate(-1)
  }, [disableGoBack, navigate])

  if (renderingInModal) {
    return <PageTitle renderingInModal={renderingInModal} {...props} />
  }

  return (
    <PageTitle
      {...props}
      boxComponent={
        <ShadowedBox as={Button} onClick={handleBackClick} variant="outlined">
          <Icon as={HiArrowNarrowLeft} fontSize="2xl" />
        </ShadowedBox>
      }
    />
  )
}
