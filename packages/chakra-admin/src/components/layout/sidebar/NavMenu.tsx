import React, { FC, useMemo } from 'react'
import { chakra, Icon, Stack, Text } from '@chakra-ui/react'
import { FaUserAlt, FaBuilding, FaWarehouse } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { RiLayoutMasonryLine, RiMapPin2Fill } from 'react-icons/ri'
import { MdGroups } from 'react-icons/md'
import { MenuItemLink } from './MenuItemLink'
import { useAuthUser } from '../../../core/auth/useAuthUser'
import { Loading } from '../../admin/Loading'

type Props = {
  onItemClick?: () => void
}
export const NavMenu: FC<Props> = ({ onItemClick }) => {
  const { initialized, user } = useAuthUser()

  const isBackofficeLimited = useMemo(() => {
    if (user && user.roles && user.roles.length > 0 && user.roles[0].params) {
      return user.roles[0].params.backofficeIsLimited
    }
    return true
  }, [user])

  if (!initialized) {
    // add me a Skeleton
    return null
  }

  return (
    <chakra.div as="nav" role="nav" w="100%">
      <Stack as="ul">
        <MenuItemLink
          icon={<Icon as={RiLayoutMasonryLine} fontSize="10px" />}
          to="/"
          exact
          label="Dashboard"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaUserAlt} fontSize="10px" />}
          to="/"
          exact
          label="Risorse"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaUserAlt} fontSize="10px" />}
          to="/"
          exact
          label="Clienti"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaUserAlt} fontSize="10px" />}
          to="/"
          exact
          label="Fornitori"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaBuilding} fontSize="10px" />}
          to="/"
          exact
          label="Organizzazioni"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaWarehouse} w="15px" h="13px" />}
          to="/"
          exact
          label="Magazzino"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={RiMapPin2Fill} w="14px" h="20px" />}
          to="/"
          exact
          label="Luoghi"
          onClick={onItemClick}
        />
        {!isBackofficeLimited && (
          <MenuItemLink
            icon={<Icon as={FaUserAlt} fontSize="10px" />}
            to="/User"
            label="Utenti"
            onClick={onItemClick}
          />
        )}
        {!isBackofficeLimited && (
          <MenuItemLink
            icon={<Icon as={ImProfile} />}
            to="/Role"
            label="Ruoli"
            onClick={onItemClick}
          />
        )}
      </Stack>
    </chakra.div>
  )
}
