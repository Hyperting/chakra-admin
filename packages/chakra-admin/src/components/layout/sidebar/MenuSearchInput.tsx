import React, { FC } from 'react'
import { Input, InputGroup, InputGroupProps, InputRightElement } from '@chakra-ui/input'
import { IoIosSearch } from 'react-icons/io'
import Icon from '@chakra-ui/icon'

export type MenuSearchInputProps = {
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
} & InputGroupProps

export const MenuSearchInput: FC<MenuSearchInputProps> = ({
  placeholder,
  onChange,
  value,
  ...props
}) => {
  return (
    <InputGroup {...props}>
      <Input
        _placeholder={{ color: 'gray.500', fontSize: 'sm' }}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <InputRightElement children={<Icon as={IoIosSearch} h={21} w={21} color="gray.500" />} />
    </InputGroup>
  )
}
