import React, { FC } from 'react'
import { Box } from '@chakra-ui/layout'
import { MenuSearchInput, MenuSearchInputProps } from './MenuSearchInput'

type Props = {
  //
} & MenuSearchInputProps

export const MenuSearch: FC<Props> = ({ ...props }) => {
  return (
    <Box pl={6} pr={4}>
      <MenuSearchInput {...props} />
    </Box>
  )
}
