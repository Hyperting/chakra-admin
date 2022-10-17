import React, { Children, cloneElement, FC, isValidElement, useCallback, useMemo } from 'react'
import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  useBreakpointValue,
  useDisclosure,
  chakra,
  DrawerCloseButton,
  BoxProps,
  Box,
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import { MdFilterList } from 'react-icons/md'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'
import { DrawerHeader } from '../modal/DrawerHeader'
import { Input, InputProps } from '../inputs/Input'

export type FiltersProps = Partial<UseListReturn & ListProps> & {
  children?: React.ReactNode
  filtersTitle?: string
  filtersButtonLabel?: string
  removeFiltersButtonLabel?: string
  containerProps?: BoxProps
}

const InDrawerInputControl: FC<Partial<InputProps>> = ({
  children,
  label,
  source,
  helperText,
  showFormControl = true,
}) => {
  if (!showFormControl) {
    return <>{children}</>
  }

  return (
    <FormControl id={source} my={2}>
      {(label || source) && <FormLabel fontWeight="semibold">{label || source}</FormLabel>}
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export const Filters: FC<FiltersProps> = ({
  onFiltersChange,
  currentFilters,
  children,
  filtersTitle = 'Filtri',
  filtersButtonLabel = 'Filtri',
  removeFiltersButtonLabel = 'Rimuovi i filtri',
  defaultFilters,
  containerProps = {},
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const handleFilterChange = useCallback(
    (source, parse?) =>
      (value: string): void => {
        if (onFiltersChange) {
          onFiltersChange({ ...currentFilters, [source]: parse ? parse(value) : value })
        }
      },
    [currentFilters, onFiltersChange]
  )

  const handleClearFilters = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange({})
    }
  }, [onFiltersChange])

  const activeFiltersCount = useMemo<number>(
    () => (currentFilters ? Object.keys(currentFilters || {}).length - Object.keys(defaultFilters || {}).length : 0),
    [currentFilters, defaultFilters]
  )

  const alwaysOnFilters = useMemo(
    () => Children.toArray(children).filter((child) => !!(child as any).props.alwaysOn),
    [children]
  )

  const hiddenFilters = useMemo(
    () => Children.toArray(children).filter((child) => !(child as any).props.alwaysOn),
    [children]
  )

  const handleRemoveFiltersFromDrawer = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange({})
      onClose()
    }
  }, [onClose, onFiltersChange])

  return (
    <>
      <Box display="flex" alignItems="center" {...containerProps}>
        {!isMobile &&
          Children.map(alwaysOnFilters, (child, index) => {
            if (isValidElement(child)) {
              return cloneElement(child, {
                onChange: handleFilterChange(child.props.source, child.props.parse) as unknown as any,
                value:
                  child.props.format && currentFilters && currentFilters[child.props.source]
                    ? child.props.format(currentFilters[child.props.source])
                    : (currentFilters || {})[child.props.source] || undefined,
                w: '300px',
                mr: 4,
                key: `filter-input-${index}`,
                variant: 'filled',
              } as any)
            }
            return null
          })}
        {(isMobile && hiddenFilters.length === 0) || hiddenFilters.length > 0 ? (
          <Button pos="relative" variant="outline" onClick={onOpen} rightIcon={<Icon as={MdFilterList} />} role="group">
            {activeFiltersCount > 0 && (
              <Badge
                pos="absolute"
                top="-10px"
                right="-10px"
                w="20px"
                h="20px"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                colorScheme="red"
                borderRadius="50%"
                fontSize="x-small"
                _groupHover={{
                  backgroundColor: 'red.500',
                  color: 'white',
                }}
              >
                {activeFiltersCount}
              </Badge>
            )}
            {filtersButtonLabel}
          </Button>
        ) : null}
        {activeFiltersCount > 0 && !isMobile ? (
          <Button onClick={handleClearFilters} ml={4} variant="ghost" colorScheme="red">
            {removeFiltersButtonLabel}
          </Button>
        ) : null}
      </Box>

      <Drawer size={isMobile ? 'xs' : 'md'} isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />

            <DrawerHeader
              title={filtersTitle}
              subtitle={
                activeFiltersCount > 0 ? (
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    px="5px"
                    ml="-5px"
                    color="red"
                    fontWeight="normal"
                    fontSize="md"
                    onClick={handleRemoveFiltersFromDrawer}
                  >
                    {removeFiltersButtonLabel}
                  </Button>
                ) : (
                  <chakra.div h="40px" />
                )
              }
            />
            <DrawerBody px={{ base: 5, lg: 12 }} display="flex" flexDir="column">
              {isMobile
                ? Children.map(children, (child, index) => {
                    if (isValidElement(child)) {
                      return (
                        <InDrawerInputControl {...child.props}>
                          {cloneElement(child, {
                            onChange: handleFilterChange(child.props.source, child.props.parse),
                            value:
                              child.props.format && currentFilters && currentFilters[child.props.source]
                                ? child.props.format(currentFilters[child.props.source])
                                : (currentFilters || {})[child.props.source] || undefined,
                          } as any)}
                        </InDrawerInputControl>
                      )
                    }
                    return null
                  })
                : Children.map(hiddenFilters, (child, index) => {
                    if (isValidElement(child)) {
                      return (
                        <InDrawerInputControl {...child.props}>
                          {cloneElement(child, {
                            onChange: handleFilterChange(child.props.source, child.props.parse),
                            value:
                              child.props.format && currentFilters && currentFilters[child.props.source]
                                ? child.props.format(currentFilters[child.props.source])
                                : (currentFilters || {})[child.props.source] || undefined,
                          } as any)}
                        </InDrawerInputControl>
                      )
                    }
                    return null
                  })}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
