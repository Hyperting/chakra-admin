import React, { FC } from 'react'
import { Button, Collapse, Icon, Text, useDisclosure, Box, BoxProps } from '@chakra-ui/react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

type Props = {
  label?: string
  additionalElement?: React.ReactNode
} & BoxProps

export const MenuCollapse: FC<Props> = ({
  label = 'Menu',
  children,
  additionalElement,
  ...props
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true })

  return (
    <Box w="100%">
      <Button
        variant="ghost"
        isFullWidth
        pl={6}
        pr={8}
        mt={4}
        mb={1}
        d="flex"
        size="sm"
        borderRadius="none"
        justifyContent="space-between"
        alignItems="center"
        onClick={onToggle}
        minH="28px"
        h="28px"
      >
        <Text fontSize="xs" color="gray.500">
          {label}
        </Text>

        <Box d="flex" alignItems="center" as="span">
          {additionalElement && additionalElement}
          <Icon as={isOpen ? BsChevronUp : BsChevronDown} color="gray.500" />
        </Box>
      </Button>
      <Collapse in={isOpen}>
        <Box pb={3} pl={6} pr={4} {...props}>
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}
