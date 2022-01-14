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
  HStack,
  VStack,
  AspectRatio,
  WrapItem,
  Square,
  Circle,
  GridItem,
  Portal,
  Kbd,
  List,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'
import { keys } from 'ts-transformer-keys/index'
import get from 'lodash.get'

export const ChakraLayoutComponents = [
  AspectRatio,
  Box,
  Center,
  Square,
  Circle,
  Container,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Wrap,
  WrapItem,
  FormControl,
  SimpleGrid,
  Portal,
  List,
  OrderedList,
  UnorderedList,
]

const ChakraLayoutComponentNames = [
  'AspectRatio',
  'Box',
  'Center',
  'Square',
  'Circle',
  'Container',
  'Flex',
  'Grid',
  'GridItem',
  'SimpleGrid',
  'Stack',
  'HStack',
  'VStack',
  'Wrap',
  'WrapItem',
  'FormControl',
  'SimpleGrid',
  'Portal',
  'List',
  'OrderedList',
  'UnorderedList',
] as const

export const ChakraDisplayComponents = [Badge, Code, Kbd, Tag, Progress, Text, Heading]

const ChakraDisplayComponentNames = [
  'Badge',
  'Code',
  'Kbd',
  'Tag',
  'Progress',
  'Text',
  'Heading',
] as const

type LayoutComponentsKey = typeof ChakraLayoutComponentNames[number]
type DisplayComponentsKey = typeof ChakraDisplayComponentNames[number]

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
  [Component in LayoutComponentsKey]: any
}

function _ca<P = {}, T = ChakraComponent<'div', P>>(component: T): FC<P & { [x: string]: any }> {
  return ({ children, record, ...props }) => {
    return createElement(
      component as any,
      props,
      Children.toArray(children).map((child) => {
        return cloneElement(child as any, {
          ...filterChakraProps(props || {}),
          ...((child as any).props || {}),
          record,
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
