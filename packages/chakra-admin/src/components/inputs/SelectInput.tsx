import React, { ChangeEventHandler, FC, useCallback } from 'react'
import { Select, SelectProps } from '@chakra-ui/react'
import { BaseInputProps } from './BaseInputProps'
import { FilterInputProps } from './FilterInputProps'

export type SelectInputProps = FilterInputProps & BaseInputProps & SelectProps

export const SelectInput: FC<SelectInputProps> = ({
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
    <Select
      placeholder={label && typeof label === 'string' ? label : source}
      label={label}
      {...rest}
      value={register ? undefined : value || ''}
      onChange={register ? undefined : handleChange}
      {...(register ? (register(source) as any) : {})}
    />
  )
}
