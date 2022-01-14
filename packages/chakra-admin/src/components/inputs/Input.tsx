import React, { ChangeEventHandler, FC, useCallback } from 'react'
import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react'
import { BaseInputProps } from './BaseInputProps'
import { FilterInputProps } from './FilterInputProps'

export type InputProps = FilterInputProps & BaseInputProps & ChakraInputProps

export const Input: FC<InputProps> = ({
  onChange: onChangeProp,
  value,
  source,
  alwaysOn,
  label,
  register,
  format,
  parse,
  ...rest
}) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (onChangeProp) {
        onChangeProp(event.target.value)
      }
    },
    [onChangeProp]
  )

  return (
    <ChakraInput
      placeholder={label && typeof label === 'string' ? label : source}
      label={label}
      _placeholder={{ color: 'blackAlpha.500' }}
      {...rest}
      {...(register ? register(source) : {})}
      value={register ? undefined : value || ''}
      onChange={register ? undefined : handleChange}
    />
  )
}
