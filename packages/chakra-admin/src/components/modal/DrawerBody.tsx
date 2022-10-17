import React, { FC } from 'react'
import { DrawerBody as ChakraDrawerBody, ModalBodyProps } from '@chakra-ui/react'

export const DrawerBody: FC<ModalBodyProps> = (props) => {
  return <ChakraDrawerBody px={{ base: 12, lg: 12 }} {...props} />
}
