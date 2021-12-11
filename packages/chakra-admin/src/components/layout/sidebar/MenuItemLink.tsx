import React, { FC } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { chakra, Button, ButtonProps } from '@chakra-ui/react'

type Props = {
  to: string
  label: string
  exact?: boolean
  icon?: React.ReactElement
} & ButtonProps

export const MenuItemLink: FC<Props> = ({ to, exact, label, icon, ...rest }) => {
  const match = useRouteMatch({
    exact,
    path: to,
  })

  return (
    <chakra.div as="li" userSelect="none" listStyleType="none">
      <Button
        variant="ghost"
        isFullWidth
        as={Link}
        to={to}
        pr={4}
        h="40px"
        minH="40px"
        maxH="40px"
        pl={2}
        color="gray.900"
        fontSize="sm"
        fontWeight="normal"
        isActive={!!match}
        _active={{ fontWeight: 'bold', bgColor: 'gray.100' }}
        leftIcon={
          icon
            ? React.cloneElement(icon, {
                mr: '10px',
                fontSize: '14px',
                mt: '-1px',
                color: 'gray.900',
              })
            : undefined
        }
        justifyContent="flex-start"
        alignItems="center"
        colorScheme="gray"
        {...rest}
      >
        {label}
      </Button>
    </chakra.div>
  )
}
