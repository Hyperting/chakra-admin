import React, { FC } from 'react'
import { Avatar, Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiLogOut } from 'react-icons/fi'
import { LogoutButton } from '../../buttons/LogoutButton'
import { useAuthUser } from '../../../core/auth/useAuthUser'

type Props = {}

export const AccountBox: FC<Props> = ({ ...props }) => {
  const { initialized, user } = useAuthUser()

  return (
    <Flex
      padding="13px 16px"
      borderTop="1px solid #E9E9E8"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex width="fit-content" alignItems="center">
        <Box border="2px solid #DBDBDB" w="38x" h="38px" borderRadius="50%">
          <Avatar src={user?.avatarUrl} maxW="34px" maxH="34px" bg="#DBDBDB" />
        </Box>
        <Box ml={4}>
          <Text
            color="gray.700"
            fontWeight="600"
            textTransform="capitalize"
            lineHeight="17.64px"
            letterSpacing="0.2px"
            fontSize="14px"
          >
            {user?.roles[0].name}
          </Text>
          <Text textStyle="description" textTransform="capitalize">
            {user?.fullName}
          </Text>
        </Box>
      </Flex>

      <LogoutButton
        icon={<Icon as={FiLogOut} color="black" w="20px" height="20px" />}
        label=""
        colorScheme="whiteAlpha"
      />
    </Flex>
  )
}
