import { Children, cloneElement, createElement } from 'react'
import {
  AlertDescription,
  AlertDescriptionProps,
  AlertTitle,
  AlertTitleProps,
  As,
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
  Tag,
  TagProps,
  Text,
  TextProps,
} from '@chakra-ui/react'
import get from 'lodash.get'
import { useField } from '../fields/useField'
import { filterChakraProps } from './system-utils'

export const CAFieldComponents = {
  AlertTitle: caField<AlertTitleProps>(AlertTitle),
  AlertDescription: caField<AlertDescriptionProps>(AlertDescription),
  Avatar: caField<AvatarProps>(Avatar),
  Badge: caField<BadgeProps>(Badge),
  CircularProgress: caField<CircularProgressProps>(CircularProgress, { target: 'value' }),
  Code: caField<CodeProps>(Code),
  Kbd: caField<KbdProps>(Kbd),
  Tag: caField<TagProps>(Tag),
  Progress: caField<ProgressProps>(Progress, { target: 'value' }),
  StatLabel: caField<StatLabelProps>(StatLabel, { type: 'mixed-layout' }),
  StatHelpText: caField<StatHelpTextProps>(StatHelpText, { type: 'mixed-layout' }),
  StatNumber: caField<StatNumberProps>(StatNumber, { type: 'mixed-layout' }),
  StatArrow: caField<StatArrowProps>(StatArrow, { target: 'type' }),
  Text: caField<TextProps>(Text),
  Heading: caField<HeadingProps>(Heading),
}

export type CAFieldOptions<P = Record<string, any>> = {
  type?: 'simple' | 'mixed-layout'
  target?: keyof P
}

export type CAFieldProps<P = {}, TItem = Record<string, any>> = {
  source?: keyof TItem | ((record: TItem) => TItem)
  sources?: Partial<Record<keyof P, keyof TItem | ((record: TItem) => TItem)>>
  record?: TItem
  sortable?: boolean
  label?: string
}

export function caField<P = {}, TItem = Record<string, any>, T = As<any>>(
  component: T,
  options: CAFieldOptions<P> = { target: 'children' as any, type: 'simple' }
) {
  const target = options?.target || 'children'
  const type = options?.type || 'simple'

  function CAFieldImpl<TItemField = TItem>(props: P & CAFieldProps<P, TItemField>) {
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
          : [])
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
          : children
      )
    }
  }

  CAFieldImpl.displayName = `CA${(component as any).displayName || (component as any).name}`

  return CAFieldImpl
}
