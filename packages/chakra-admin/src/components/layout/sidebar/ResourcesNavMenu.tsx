import React, { FC, useMemo } from 'react'
import { NavMenuProps } from '.'
import { useAdminStateValue } from '../../../core/admin/adminState'
import { MenuItemLink } from './MenuItemLink'
import { NavMenu } from './NavMenu'

export const ResourcesNavMenu: FC<NavMenuProps> = (props) => {
  const { registeredResources, initialized } = useAdminStateValue()

  const registeredResourcesKeys = useMemo(() => Object.keys(registeredResources).sort(), [
    registeredResources,
  ])

  if (!initialized) {
    return null
  }

  return (
    <NavMenu {...props}>
      {registeredResourcesKeys.map((resourceName) => (
        <MenuItemLink
          key={`resource-menu-item-${resourceName}`}
          // TODO: add resource icon
          // icon={<Icon as={RiLayoutMasonryLine} fontSize="10px" />}
          to={`/${resourceName}`}
          label={resourceName}
        />
      ))}
    </NavMenu>
  )
}
