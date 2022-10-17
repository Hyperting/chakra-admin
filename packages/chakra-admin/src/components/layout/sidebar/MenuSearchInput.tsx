import React, { FC } from 'react'
import { Input, InputGroup, InputGroupProps, InputRightElement, Icon } from '@chakra-ui/react'
import { IoIosSearch } from 'react-icons/io'

export type MenuSearchInputProps = {
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
} & InputGroupProps

export const MenuSearchInput: FC<MenuSearchInputProps> = ({ placeholder, onChange, value, ...props }) => {
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
