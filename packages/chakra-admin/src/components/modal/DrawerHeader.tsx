import React, { FC } from 'react'
import { DrawerHeader as ChakraDrawerHeader, ModalHeaderProps, Text } from '@chakra-ui/react'

type Props = {
  title?: string
  subtitle?: React.ReactNode
} & ModalHeaderProps

export const DrawerHeader: FC<Props> = ({ title, subtitle, children }) => {
  return (
    <ChakraDrawerHeader pl={14} pr={14} pt={12} pb={0} fontWeight="800" lineHeight="32px">
      <Text as="h2" fontSize="2xl">
        {title}
      </Text>
      {subtitle ? (
        typeof subtitle === 'string' ? (
          <Text color="gray" fontWeight="normal" fontSize="md">
            {subtitle}
          </Text>
        ) : (
          subtitle
        )
      ) : null}
      {children}
    </ChakraDrawerHeader>
  )
}
