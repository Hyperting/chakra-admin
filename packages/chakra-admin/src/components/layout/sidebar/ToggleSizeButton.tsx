import React, { FC } from 'react'
import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

type Props = {
  isCompressed: boolean
} & Omit<IconButtonProps, 'aria-label'>

export const ToggleSizeButton: FC<Props> = ({ isCompressed, ...props }) => {
  return (
    <IconButton
      aria-label="Toggle sidebar size"
      pos="absolute"
      right="0px"
      top="25px"
      minW="15px"
      w="15px"
      h="30px"
      borderRightRadius="none"
      borderLeftRadius="md"
      icon={isCompressed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      zIndex="1"
      {...props}
    />
  )
}
