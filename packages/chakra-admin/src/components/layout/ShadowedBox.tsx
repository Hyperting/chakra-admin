import React, { FC } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export const ShadowedBox: FC<BoxProps & { [prop: string]: any }> = ({ ...rest }) => {
  return (
    <Box
      w="45px"
      minW="45px"
      h="45px"
      minH="45px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      content="''"
      border="gray.100"
      boxShadow="base"
      borderRadius="4px"
      backgroundSize="contain"
      backgroundPosition="center center"
      backgroundRepeat="no-repeat"
      {...rest}
    />
  )
}
