/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import React, { Children, cloneElement, createElement, FC, useMemo } from 'react'
import {
  Box,
  Center,
  ChakraComponent,
  ChakraProps,
  Container,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Wrap,
  Text,
  Badge,
  Code,
  Tag,
  Progress,
  Heading,
  Checkbox,
  Editable,
  Input,
  Textarea,
  FormControl,
} from '@chakra-ui/react'
import { keys } from 'ts-transformer-keys/index'
import get from 'lodash.get'

export const ChakraLayoutComponents = [
  Box,
  Center,
  Container,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Wrap,
  FormControl,
]

export const ChakraDisplayComponents = [Badge, Code, Tag, Progress, Text, Heading]

export const ChakraFormComponents = [Checkbox, Editable, Input, Textarea]

const ChakraLayoutComponentNames = [
  'Box',
  'Center',
  'Container',
  'Flex',
  'Grid',
  'SimpleGrid',
  'Stack',
  'Wrap',
  'FormControl',
] as const

type NeededUnionType = typeof ChakraLayoutComponentNames[number]

const chakraProps = keys<ChakraProps>()

function filterChakraProps<P = {}>(props: P): P {
  return Object.keys(props).reduce((acc, key) => {
    if (chakraProps.includes((key as unknown) as keyof ChakraProps)) {
      return acc
    }

    return {
      ...acc,
      [key]: props[key],
    }
  }, {}) as P
}

export type CAFactory = <P = {}, T = ChakraComponent<'div', P>>(
  component: T,
  options?: CAFieldOptions
) => FC<P & { [x: string]: any }>

export type CAComponents = {
  [Component in NeededUnionType]: any
}

function _ca<P = {}, T = ChakraComponent<'div', P>>(component: T): FC<P & { [x: string]: any }> {
  return ({ children, record, ...props }) => {
    return createElement(
      component as any,
      props,
      Children.toArray(children).map((child) => {
        console.log(child, record, props, 'child')
        return cloneElement(child as any, {
          ...filterChakraProps(props || {}),
          ...((child as any).props || {}),
          record,
          // ...props,
        })
      })
    )
  }
}

export type CAFieldOptions = {
  targetProp?: string
}

export function caField<P = {}, T = ChakraComponent<'div', P>>(
  component: T,
  options: CAFieldOptions = { targetProp: 'children' }
): FC<P & { [x: string]: any }> {
  return ({ record, source, ...props }) => {
    const value = useMemo(() => get(record || {}, source, undefined), [record, source])
    console.log(value, record, source, props, 'ciao')
    if (options.targetProp === 'children' || !options.targetProp) {
      return createElement(component as any, { ...props }, value)
    } else {
      return createElement(component as any, { ...props, [options.targetProp]: value })
    }
  }
}

export const ca = (_ca as unknown) as CAFactory & CAComponents

for (const layoutComponent of ChakraLayoutComponents) {
  ca[layoutComponent.displayName!] = ca(layoutComponent)
}
