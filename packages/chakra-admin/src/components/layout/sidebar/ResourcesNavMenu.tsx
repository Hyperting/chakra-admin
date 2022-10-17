import { Icon } from '@chakra-ui/react'
import React, { FC, useMemo } from 'react'
import { NavMenuProps } from '.'
import { registeredIcons, useAdminStateValue } from '../../../core/admin/adminState'
import { useGetResourceLabel } from '../../../core/admin/useGetResourceLabel'
import { MenuItemLink } from './MenuItemLink'
import { NavMenu } from './NavMenu'

export const ResourcesNavMenu: FC<NavMenuProps> = (props) => {
  const { registeredResources, initialized } = useAdminStateValue()
  const getResourceLabel = useGetResourceLabel()

  const registeredResourcesKeys = useMemo(() => Object.keys(registeredResources).sort(), [registeredResources])

  if (!initialized) {
    return null
  }

  return (
    <NavMenu {...props}>
      {registeredResourcesKeys.map((resourceName) => (
        <MenuItemLink
          key={`resource-menu-item-${resourceName}`}
          // TODO: add resource icon
          icon={
            registeredResources[resourceName]?.iconName &&
            registeredIcons[registeredResources[resourceName]?.iconName] ? (
              <Icon as={registeredIcons[registeredResources[resourceName]?.iconName] as any} fontSize="10px" />
            ) : undefined
          }
          to={`/${resourceName}`}
          label={getResourceLabel(resourceName)}
        />
      ))}
    </NavMenu>
  )
}
