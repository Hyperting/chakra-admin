import { InputProps } from '@chakra-ui/react'
import React from 'react'
import { UseFormRegister, Control } from 'react-hook-form'

export type BaseInputProps = {
  source: string
  onChange?: (newValue: string) => void
  value?: string
  label?: React.ReactNode
  helperText?: React.ReactNode
  register?: UseFormRegister<any>
  control?: Control
  parse?: <Input = any, Return = any>(inputValue: Input) => Return
  format?: <Input = any, Return = any>(inputValue: Input) => Return
} & Omit<InputProps, 'value' | 'onChange'>
