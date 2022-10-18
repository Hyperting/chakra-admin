import React, { FC, useCallback } from 'react'
import { Button, Collapse, Icon, Text, Box, BoxProps, UseDisclosureProps, useDisclosure } from '@chakra-ui/react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { useLocalStorage } from '../../../core/store/useLocalStorage'

export type MenuCollapseViewProps = {
  id?: string
  label?: string
  additionalElement?: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
} & BoxProps

export const MenuCollapseView: FC<MenuCollapseViewProps> = ({
  id,
  label = 'Menu',
  children,
  additionalElement,
  isOpen,
  onToggle,
  ...props
}) => {
  return (
    <Box w="100%">
      <Button
        variant="ghost"
        pl={6}
        pr={8}
        mt={4}
        mb={1}
        display="flex"
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

        <Box display="flex" alignItems="center" as="span">
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

export type MenuCollapseProps = Omit<MenuCollapseViewProps, 'onToggle' | 'isOpen'> & UseDisclosureProps

export const MenuCollapse: FC<MenuCollapseProps> = ({
  id,
  defaultIsOpen,
  isOpen: isOpenProp,
  onClose,
  onOpen,
  ...rest
}) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen,
    id,
    isOpen: isOpenProp,
    onClose,
    onOpen,
  })

  return <MenuCollapseView {...rest} />
}

export type StoredMenuCollapseProps = Omit<MenuCollapseViewProps, 'id' | 'onToggle' | 'isOpen'> & {
  id: string
  defaultIsOpen?: boolean
}

export const StoredMenuCollapse: FC<StoredMenuCollapseProps> = ({ id, defaultIsOpen = true, ...rest }) => {
  const [isOpen, setIsOpen] = useLocalStorage<boolean>(`ca-menu-collapse-${id}-is-open`, defaultIsOpen)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [setIsOpen])

  return <MenuCollapseView onToggle={handleToggle} isOpen={isOpen} {...rest} />
}
