import React, { FC } from 'react'
import { As, Heading, Icon, Center, Flex, Box, BoxProps, ModalHeader } from '@chakra-ui/react'
import { ShadowedBox } from '../layout/ShadowedBox'

export type PageTitleProps = {
  label?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: As | undefined
  boxComponent?: React.ReactNode
  renderingInModal?: boolean
  loading?: boolean
  resource?: string
  data?: any
  error?: any
  record?: any
} & BoxProps

export const PageTitle: FC<PageTitleProps> = ({
  label,
  icon,
  boxComponent,
  renderingInModal,
  loading,
  resource,
  data,
  error,
  record,
  ...rest
}) => {
  if (renderingInModal) {
    return (
      <ModalHeader
        fontSize="2xl"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        boxShadow="0px 3px 12px rgba(37, 31, 30, 0.05)"
        px={6}
        py={4}
        {...rest}
      >
        <Flex alignItems="center">
          {boxComponent ||
            (icon ? (
              <Center bgColor="gray.100" w="44px" h="44px" borderRadius="md" mr={4}>
                <Icon color="gray.500" as={icon} fontSize="2xl" />
              </Center>
            ) : null)}

          {label}
        </Flex>
      </ModalHeader>
    )
  }

  return (
    <Box display="flex" alignItems="center" mr={2} {...rest}>
      {boxComponent ||
        (icon ? (
          <ShadowedBox>
            <Icon as={icon} fontSize="2xl" />
          </ShadowedBox>
        ) : null)}
      <Heading as="h1" fontSize={{ base: 'xl', lg: '4xl' }} ml={{ base: 4, lg: 6 }}>
        {label}
      </Heading>
    </Box>
  )
}
