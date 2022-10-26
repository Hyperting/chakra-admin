import React, { FC } from 'react'
import { Avatar, Box, Flex, FlexProps, Icon, Text } from '@chakra-ui/react'
import { FiLogOut } from 'react-icons/fi'
import { LogoutButton } from '../../buttons/LogoutButton'
import { useAuthUser } from '../../../core/auth/useAuthUser'

type Props = {} & FlexProps

export const AccountBox: FC<Props> = ({ ...props }) => {
  const { initialized, user } = useAuthUser()

  return (
    <Flex
      py={3.5}
      px={4}
      borderTop="1px solid"
      borderColor="gray.200"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      {...props}
    >
      <Flex width="fit-content" alignItems="center">
        <Box border="2px solid" borderColor="gray.200" w="38x" h="38px" borderRadius="full">
          <Avatar src={user?.avatarUrl} maxW="34px" maxH="34px" bg="gray.200" />
        </Box>
        <Box ml={4}>
          <Text
            color="gray.700"
            fontWeight="600"
            textTransform="capitalize"
            lineHeight="17.64px"
            letterSpacing="0.2px"
            fontSize="md"
            noOfLines={1}
          >
            {user?.roles[0].name}
          </Text>
          <Text textStyle="description" textTransform="capitalize" noOfLines={1}>
            {user?.fullName}
          </Text>
        </Box>
      </Flex>

      <LogoutButton icon={<Icon as={FiLogOut} color="black" w={5} h={5} />} label="" colorScheme="whiteAlpha" />
    </Flex>
  )
}
