/* eslint-disable global-require */
import React, { FC } from 'react'
import { Button, Icon, Skeleton, Text, useDisclosure, chakra } from '@chakra-ui/react'
import { FiMoreVertical } from 'react-icons/fi'
import { UserSettingsDrawer } from '../layout/UserSettingsDrawer'
import { ShadowedBox } from '../layout/ShadowedBox'
import { useAuthUser } from '../../core/auth/useAuthUser'

type Props = {}

export const UserButton: FC<Props> = () => {
  const { initialized, user } = useAuthUser()
  const { onOpen, isOpen, onClose } = useDisclosure()

  if (!initialized) {
    return (
      <chakra.div display="flex" alignItems="center">
        <Icon ml={2} mr={1} as={FiMoreVertical} fontSize="20px" color="red.200" />
        <Skeleton w="45px" h="45px" borderRadius="4px" />

        <chakra.div display="inline-flex" flexDir="column" ml={4} alignItems="flex-start">
          <Skeleton h="12px" w="60px" />
          <Skeleton mt="12px" h="12px" w="80px" />
        </chakra.div>
      </chakra.div>
    )
  }

  return (
    <>
      <Button variant="unstyled" display="flex" onClick={onOpen}>
        <Icon ml={2} mr={1} as={FiMoreVertical} fontSize="20px" color="red.200" />
        <ShadowedBox backgroundImage="url('/coop-italia.png')" />
        <chakra.span display="inline-flex" flexDir="column" ml={4} alignItems="flex-start">
          <Text
            fontSize="xs"
            color="red.500"
            fontWeight="800"
            lineHeight="24px"
            maxW="50%"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {user?.fullName}
          </Text>
          {user?.roles && (
            <Text fontSize="xs" color="gray.900" opacity={0.5} fontWeight="thin">
              {user.roles.map((item: any) => item.name).join(' ')}
            </Text>
          )}
        </chakra.span>
      </Button>
      <UserSettingsDrawer placement="left" isOpen={isOpen} onClose={onClose} />
    </>
  )
}
