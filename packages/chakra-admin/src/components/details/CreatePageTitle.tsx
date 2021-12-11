import { Button, Icon } from '@chakra-ui/react'
import React, { FC, useCallback } from 'react'
import { HiArrowNarrowLeft } from 'react-icons/hi'
import { useHistory } from 'react-router'
import { PageTitle, PageTitleProps } from '../layout/PageTitle'
import { ShadowedBox } from '../layout/ShadowedBox'

type Props = PageTitleProps & {
  disableGoBack?: boolean
}

export const CreatePageTitle: FC<Props> = ({ disableGoBack, ...props }) => {
  const history = useHistory()
  const handleBackClick = useCallback(() => {
    if (disableGoBack) {
      return
    }
    history.goBack()
  }, [disableGoBack, history])

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
