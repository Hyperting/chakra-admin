/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import React, {
  Children,
  cloneElement,
  createElement,
  FC,
  JSXElementConstructor,
  ReactElement,
  useMemo,
} from 'react'
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
  As,
  TabPanel,
  TabPanels,
  Tabs,
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
  Tabs,
  TabPanels,
  TabPanel,
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
  'Tabs',
  'TabPanels',
  'TabPanel',
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

export function filterChakraProps<P = {}>(props: P): P {
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

export type CAFactory = <P = {}, T = ChakraComponent<any, P>>(
  component: T,
  options?: CAFieldOptions
) => FC<P & { [x: string]: any }>

export type CAComponents = {
  [Component in LayoutComponentsKey]: any
}

function _ca<P = {}, T = React.ReactNode>(component: T): FC<P & { [x: string]: any }> {
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

export type CAFieldProps<TItem = Record<string, any>> = {
  source: keyof TItem
  record?: TItem
  sortable?: boolean
  label?: string
}

export function caField<P = {}, TItem = Record<string, any>, T = As<any>>(
  component: T,
  options: CAFieldOptions = { targetProp: 'children' }
) {
  function CaFieldImpl<TItemField = TItem>({
    record,
    source,
    ...props
  }: Partial<P & CAFieldProps<TItemField>>) {
    const value = useMemo(() => get(record || {}, source, undefined), [record, source])
    if (options.targetProp === 'children' || !options.targetProp) {
      return createElement(component as any, { ...props }, value)
    } else {
      return createElement(component as any, { ...props, [options.targetProp]: value })
    }
  }

  CaFieldImpl.displayName = `CA(${(component as any).displayName || (component as any).name})`

  return CaFieldImpl
}

export const ca = (_ca as unknown) as CAFactory & CAComponents

for (const layoutComponent of ChakraLayoutComponents) {
  ca[layoutComponent.displayName!] = ca(layoutComponent)
}
