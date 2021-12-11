import React, { FC } from 'react'
import { As, chakra, Heading, Icon } from '@chakra-ui/react'
import { ShadowedBox } from './ShadowedBox'

export type PageTitleProps = {
  label?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: As<any> | undefined
  boxComponent?: React.ReactNode
}
export const PageTitle: FC<PageTitleProps> = ({ label, icon, boxComponent }) => {
  return (
    <chakra.div display="flex" alignItems="center" mr={2}>
      {boxComponent ||
        (icon ? (
          <ShadowedBox>
            <Icon as={icon} fontSize="2xl" />
          </ShadowedBox>
        ) : null)}
      <Heading as="h1" fontSize={{ base: 'xl', lg: '4xl' }} ml={{ base: 4, lg: 6 }}>
        {label}
      </Heading>
    </chakra.div>
  )
}
