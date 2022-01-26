/* eslint-disable react/require-default-props */
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Text,
  Icon,
  BoxProps,
  useDisclosure,
  useOutsideClick,
  PopoverContent,
  Popover,
  PopoverTrigger,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Circle,
} from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { useController } from 'react-hook-form'
import { HexColorPicker } from 'react-colorful'
import { BsChevronDown } from 'react-icons/bs'
import { CAInputProps } from '../../core/react/system-form'

type ColorInputProps<TItem = Record<string, any>> = {
  placeholder?: string
} & CAInputProps<TItem> &
  BoxProps

/**
 *
 * WIP: Component for choosing a color.
 *
 * @example
 *
 * <ColorInput source="color" />
 */
export function ColorInput<TItem = Record<string, any>>({
  source,
  label,
  resource,
  required,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  validate,
  valueAsNumber,
  valueAsDate,
  value: propValue,
  setValueAs,
  shouldUnregister,
  onChange: propOnChange,
  onBlur: propOnBlur,
  disabled,
  deps,
  placeholder,
  ...rest
}: ColorInputProps<TItem>) {
  const t = useTranslate({ keyPrefix: 'ca.input.single_image' })

  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: source as any,
    control: (rest as any).control,
    rules: { required, min, max, maxLength, minLength, pattern, validate },
    shouldUnregister,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef(null)
  const pickerRef = useRef(null)

  useOutsideClick({
    ref: pickerRef,
    handler: onClose,
    enabled: isOpen,
  })

  return (
    <Popover
      placement="bottom"
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isLazy
    >
      <PopoverTrigger>
        <Box onClick={onOpen} ref={initialRef} flex="1" {...rest}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Circle size="18px" bgColor={(value as string) || 'gray.200'} />
            </InputLeftElement>
            <Input
              placeholder={placeholder}
              name={name}
              color={value as string}
              ref={ref}
              value={(value as string) || ''}
              onChange={onChange}
            />
            <InputRightElement cursor="pointer" children={<Icon as={BsChevronDown} />} />
          </InputGroup>
        </Box>
      </PopoverTrigger>

      <PopoverContent
        p={0}
        w="min-content"
        border="none"
        outline="none"
        _focus={{ boxShadow: 'none' }}
        ref={pickerRef}
      >
        <HexColorPicker onChange={onChange} color={(value as string) || ''} />
      </PopoverContent>
    </Popover>
  )
}
