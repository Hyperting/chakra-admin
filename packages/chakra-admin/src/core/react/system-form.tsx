import React, { Children, cloneElement, createElement, useMemo } from 'react'
import {
  As,
  Checkbox,
  CheckboxProps,
  Editable,
  EditableProps,
  FormControl as CUIFormControl,
  FormLabel as CUIFormLabel,
  FormControlProps,
  Input,
  InputProps,
  RadioGroup,
  RadioGroupProps,
  Switch,
  SwitchProps,
  FormLabelProps,
  FormErrorMessage as CUIFormErrorMessage,
  FormErrorMessageProps,
} from '@chakra-ui/react'
import { Controller, RegisterOptions, useFormState } from 'react-hook-form'
import { useTranslate } from 'ca-i18n'
import { keys } from 'ts-transformer-keys'
import { humanize } from 'inflection'
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

export const CAFormControlComponents = {
  FormControl: CAFormControl,
  FormErrorMessage: CAFormErrorMessage,
  FormLabel: CAFormLabel,
}

export function CAFormControl<TItem = Record<string, any>>(
  props: CAInputProps<TItem> & FormControlProps
) {
  const { source, control, children, ...filteredProps } = props as any

  const { errors } = useFormState<TItem>({ control, name: source })

  return (
    <CUIFormControl isInvalid={errors[source]} {...filteredProps}>
      {Children.toArray(children).map((child) => {
        return cloneElement(child as any, {
          ...filterChakraProps(filteredProps || {}),
          control,
          source,
        })
      })}
    </CUIFormControl>
  )
}
CAFormControl.displayName = 'CAFormControl'

export function CAFormErrorMessage<TItem = Record<string, any>>(
  props: Partial<CAInputProps<TItem>> & FormErrorMessageProps
) {
  const { source, control, children, ...filteredProps } = props as any
  const { errors } = useFormState<TItem>({ control, name: source })

  return <CUIFormErrorMessage children={children || errors[source]?.message} {...filteredProps} />
}
CAFormErrorMessage.displayName = 'CAFormErrorMessage'

export function CAFormLabel<TItem = Record<string, any>>(
  props: Partial<CAInputProps<TItem>> & FormLabelProps
) {
  const { source, control, resource, children, ...filteredProps } = props as any
  const t = useTranslate({ keyPrefix: `resources.${resource}.fields` })
  const label = useMemo(
    () =>
      t(`${source}`, {
        defaultValue: source ? humanize(source) : '',
      }),
    [source, t]
  )

  return <CUIFormLabel htmlFor={source} children={children || label} {...filteredProps} />
}
CAFormLabel.displayName = 'CAFormLabel'

export type CAInputOptions<P = Record<string, any>> = {
  type?: 'ref' | 'ref-mixed-layout' | 'control' | 'control-mixed-layout'
  labelTarget?: keyof P
}

const RegisterOptionsKeys = keys<RegisterOptions>()

export type CAInputProps<TItem = Record<string, any>> = {
  // fix source prop
  source: keyof TItem
  label?: string
  resource?: string
} & RegisterOptions<TItem>

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

    const {
      source,
      register,
      unregister,
      control,
      children,
      label,
      ...filteredProps
    } = props as any
    const tAll = useTranslate()
    const t = useTranslate({ keyPrefix: `resources.${props.resource}.fields` })
    const labelProps = useMemo(() => {
      if (labelTarget) {
        return {
          // [labelTarget]: label || t(source, {key}),
          [labelTarget]: tAll(label) || t(source),
        }
      }

      return {}
    }, [tAll, label, t, source])

    if (type?.includes('ref')) {
      return createElement(
        component as any,
        {
          ...Object.keys(filteredProps || {}).reduce((acc, key) => {
            if (RegisterOptionsKeys.includes(key as any)) {
              return acc
            }

            return {
              ...acc,
              [key]: filteredProps[key],
            }
          }, {}),
          ...labelProps,
          ...register(
            source,
            Object.keys(filterChakraProps(filteredProps || {}) as any).reduce((acc: any, key) => {
              if (!RegisterOptionsKeys.includes(key as any)) {
                return acc
              }
              return {
                ...acc,
                [key]: filteredProps[key],
              }
            }, {})
          ),
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
