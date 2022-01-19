import React, { Children, cloneElement, createElement, useMemo } from 'react'
import {
  As,
  Checkbox,
  CheckboxProps,
  Editable,
  EditableProps,
  Input,
  InputProps,
  RadioGroup,
  RadioGroupProps,
  Switch,
  SwitchProps,
} from '@chakra-ui/react'
import { Controller, RegisterOptions } from 'react-hook-form'
import { useTranslate } from 'ca-i18n'
import { filterChakraProps } from './system-utils'

export const CAFormComponents = {
  Checkbox: caFormInput<CheckboxProps>(Checkbox, { labelTarget: 'children' }),
  Editable: caFormInput<EditableProps>(Editable, { type: 'control-mixed-layout' }),
  Input: caFormInput<InputProps>(Input),
  Switch: caFormInput<SwitchProps>(Switch),
  RadioGroup: caFormInput<RadioGroupProps>(RadioGroup, {
    type: 'control-mixed-layout',
    labelTarget: 'children',
  }),
}

export type CAInputOptions<P = Record<string, any>> = {
  type?: 'ref' | 'ref-mixed-layout' | 'control' | 'control-mixed-layout'
  labelTarget?: keyof P
}

export type CAInputProps<TItem = Record<string, any>> = {
  source: keyof TItem
  label?: string
  resource?: string
} & RegisterOptions

export function caFormInput<P = {}, TItem = Record<string, any>, T = As<any>>(
  component: T,
  options: CAInputOptions<P> = {
    type: 'ref',
  }
) {
  const type = options?.type || 'ref'
  const labelTarget = options?.labelTarget

  function CAFormInputImpl<TItemField = TItem>(props: P & CAInputProps<TItemField>) {
    if (!type?.includes('ref') && !type?.includes('control')) {
      throw new Error(
        'Type not recognized, please use one of the following: ref, control, ref-mixed-layout, control-mixed-layout'
      )
    }

    const { source, register, control, children, label, ...filteredProps } = props as any
    const t = useTranslate({ keyPrefix: `resources.${props.resource}.fields` })
    const labelProps = useMemo(() => {
      if (labelTarget) {
        return {
          // [labelTarget]: label || t(source, {key}),
          [labelTarget]: label || t(source),
        }
      }

      return {}
    }, [label, t, source])

    if (type?.includes('ref')) {
      return createElement(
        component as any,
        {
          ...filteredProps,
          ...labelProps,
          ...register(source, filterChakraProps(filteredProps)),
        },
        ...(type?.includes('mixed-layout')
          ? Children.toArray(children || []).map((child) => {
              return cloneElement(child as any, {
                ...((child as any).props || {}),
                ...filterChakraProps(filteredProps || {}),
              })
            })
          : Children.toArray(children || []))
      )
    } else {
      return (
        <Controller
          name={source}
          render={({ field }) => (
            <>
              {createElement(
                component as any,
                {
                  ...filteredProps,
                  ...labelProps,
                  ...field,
                },
                ...(type?.includes('mixed-layout')
                  ? Children.toArray(children || []).map((child) => {
                      return cloneElement(child as any, {
                        ...((child as any).props || {}),
                        ...filterChakraProps(filteredProps || {}),
                      })
                    })
                  : [])
              )}
            </>
          )}
          rules={filterChakraProps(filteredProps)}
          control={control}
        />
      )
    }
  }

  CAFormInputImpl.displayName = `CA${(component as any).displayName || (component as any).name}`

  return CAFormInputImpl
}
