import React, { Children, FC, ReactElement } from 'react'
import { chakra, Stack } from '@chakra-ui/react'
import { MenuItemLink } from './MenuItemLink'

export type NavMenuProps = {
  onItemClick?: () => void
}
export const NavMenu: FC<NavMenuProps> = ({ onItemClick, children }) => {
  return (
    <chakra.div as="nav" role="nav" w="100%">
      <Stack as="ul">
        {Children.map(children, (child) => {
          if (!child) {
            return null
          }

          if ((child as ReactElement).type === MenuItemLink) {
            return React.cloneElement(child as ReactElement, {
              onClick: onItemClick,
            })
          }
          return null
        })}
        {/* <MenuItemLink
          icon={<Icon as={RiLayoutMasonryLine} fontSize="10px" />}
          to="/"
          label="Dashboard"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaUserAlt} fontSize="10px" />}
          to="/"
          label="Risorse"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaUserAlt} fontSize="10px" />}
          to="/"
          label="Clienti"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaUserAlt} fontSize="10px" />}
          to="/"
          label="Fornitori"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaBuilding} fontSize="10px" />}
          to="/"
          label="Organizzazioni"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={FaWarehouse} w="15px" h="13px" />}
          to="/"
          label="Magazzino"
          onClick={onItemClick}
        />
        <MenuItemLink
          icon={<Icon as={RiMapPin2Fill} w="14px" h="20px" />}
          to="/"
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
        )} */}
      </Stack>
    </chakra.div>
  )
}
