/* eslint-disable global-require */
import React, { FC } from 'react'
import { Button, LinkBox, LinkOverlay, Icon, Skeleton, useDisclosure, chakra } from '@chakra-ui/react'
import { FiMoreVertical } from 'react-icons/fi'
import { UserSettingsDrawer } from '../layout/UserSettingsDrawer'
import { useAuthUser } from '../../core/auth/useAuthUser'

type Props = {}

export const UserMobileButton: FC<Props> = () => {
  const { initialized } = useAuthUser()
  const { onOpen, isOpen, onClose } = useDisclosure()

  if (!initialized) {
    return (
      <chakra.div display="flex" alignItems="center" justifyContent="center">
        <Skeleton w="45px" h="45px" borderRadius="4px" />
        <Icon mx={2} as={FiMoreVertical} fontSize="20px" color="red.200" />
      </chakra.div>
    )
  }

  return (
    <>
      <LinkBox as="div" display="flex" alignItems="center">
        <LinkOverlay
          as={Button}
          variant="unstyled"
          alignItems="center"
          justifyContent="center"
          w="45px"
          h="45px"
          content="''"
          border="gray.100"
          boxShadow="base"
          borderRadius="4px"
          backgroundImage="url('/coop-italia.png')"
          backgroundSize="contain"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
          onClick={onOpen}
        />
        <Icon mx={2} as={FiMoreVertical} fontSize="20px" color="red.200" />
      </LinkBox>

      <UserSettingsDrawer isOpen={isOpen} onClose={onClose} />
    </>
  )
}
