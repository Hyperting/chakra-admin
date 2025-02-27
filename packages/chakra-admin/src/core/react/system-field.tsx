import React, { Children, cloneElement, createElement, memo } from 'react'
import {
  AlertDescription,
  AlertDescriptionProps,
  AlertTitle,
  AlertTitleProps,
  Avatar,
  AvatarProps,
  Badge,
  BadgeProps,
  CircularProgress,
  CircularProgressProps,
  Code,
  CodeProps,
  Heading,
  HeadingProps,
  Image,
  ImageProps,
  Kbd,
  KbdProps,
  Progress,
  ProgressProps,
  StatArrow,
  StatArrowProps,
  StatHelpText,
  StatHelpTextProps,
  StatLabel,
  StatLabelProps,
  StatNumber,
  StatNumberProps,
  Tab,
  TabProps,
  Tag,
  TagProps,
  Text,
  TextProps,
} from '@chakra-ui/react'
import get from 'lodash.get'
import { useField } from '../fields/useField'
import { filterChakraProps } from './system-utils'
import { NestedKeyOf, Required } from './nested-key'
import { TreeRenderer } from '../../components/details/TreeRenderer'

export const CAFieldComponents = {
  AlertDescription: caField<AlertDescriptionProps>(AlertDescription),
  AlertTitle: caField<AlertTitleProps>(AlertTitle),
  Avatar: caField<AvatarProps>(Avatar),
  Badge: caField<BadgeProps>(Badge),
  CircularProgress: caField<CircularProgressProps>(CircularProgress, { target: 'value' }),
  Code: caField<CodeProps>(Code),
  Heading: caField<HeadingProps>(Heading),
  Image: caField<ImageProps>(Image, { target: 'src' }),
  Kbd: caField<KbdProps>(Kbd),
  Progress: caField<ProgressProps>(Progress, { target: 'value' }),
  StatArrow: caField<StatArrowProps>(StatArrow, { target: 'type' }),
  StatHelpText: caField<StatHelpTextProps>(StatHelpText, { type: 'mixed-layout' }),
  StatLabel: caField<StatLabelProps>(StatLabel, { type: 'mixed-layout' }),
  StatNumber: caField<StatNumberProps>(StatNumber, { type: 'mixed-layout' }),
  Tab: caField<TabProps>(Tab),
  Tag: caField<TagProps>(Tag),
  Text: caField<TextProps>(Text),
}

export type CAFieldOptions<P = Record<string, any>> = {
  type?: 'simple' | 'mixed-layout'
  target?: keyof P
}

export type CAFieldProps<P = {}, TItem extends object = Record<string, any>> = {
  source?: NestedKeyOf<Required<TItem>> | ((record: TItem) => any)
  sources?: Partial<Record<keyof P, NestedKeyOf<Required<TItem>> | ((record: TItem) => any)>>
  record?: TItem
  sortable?: boolean
  label?: string
  additionalFields?: string[]
}

export function caField<P = {}, TItem extends object = Record<string, any>, T = any>(
  component: T,
  options: CAFieldOptions<P> = { target: 'children' as any, type: 'simple' },
) {
  const target = options?.target || 'children'
  const type = options?.type || 'simple'

  function CAFieldImpl<TItemField extends object = TItem>(props: P & CAFieldProps<P, TItemField>) {
    const { record, source, sources, children, ...filteredProps } = props as any
    if (!source && !sources && type === 'simple') {
      throw new Error('You must provide either a `source` or `sources` prop')
    }

    const value = useField(props as any)

    if (source) {
      return createElement(
        component as any,
        {
          ...filteredProps,
          [target || 'children']: value,
        },
        ...(type === 'mixed-layout'
          ? Children.toArray(children || []).map((child) => {
              return cloneElement(child as any, {
                ...filterChakraProps(props || {}),
                ...((child as any).props || {}),
                record,
              })
            })
          : []),
      )
    } else {
      return createElement(
        component as any,
        {
          ...filteredProps,
          ...((Object.keys(sources || {}) || []) as (keyof P)[]).reduce((acc, item) => {
            return {
              ...acc,
              [item]:
                typeof sources[item] === 'string'
                  ? get(record || {}, (sources || ({} as any))[item], undefined)
                  : typeof sources[item] === 'function'
                    ? sources[item](record || {})
                    : undefined,
            }
          }, {}),
        },
        type === 'mixed-layout'
          ? Children.toArray(children || []).map((child) => {
              return cloneElement(child as any, {
                ...filterChakraProps(props || {}),
                ...((child as any).props || {}),
                record,
              })
            })
          : sources.children
            ? undefined
            : children,
      )
    }
  }

  CAFieldImpl.displayName = `CA${(component as any).displayName || (component as any).name}`

  return memo(CAFieldImpl, (prev, next) => {
    return prev.source === next.source && prev.sources === next.sources && prev.record === next.record
  })
}
