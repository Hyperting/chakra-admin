import React, { useMemo } from 'react'
import { Select, SelectProps } from '@chakra-ui/react'
import { OperationVariables } from '@apollo/client'
import { useController } from 'react-hook-form'
import { FilterInputProps } from './FilterInputProps'
import { Query, QueryProps } from '../graphql/Query'
import { CAInputProps } from '../../core/react/system-form'

export type SelectInputProps<
  TQuery = Record<string, any>,
  TData = any,
  TQueryData = any,
  TQueryVariables = OperationVariables
> = FilterInputProps &
  CAInputProps<TData> &
  SelectProps &
  Partial<QueryProps<TQuery, TQueryData, TQueryVariables>> & {
    getOption?: (record: TQueryData) => { value: string; label: string }
  }

export function SelectInput<
  TQuery = Record<string, any>,
  TData = any,
  TQueryData = any,
  TQueryVariables = OperationVariables
>({
  onChange: onChangeProp,
  source,
  alwaysOn,
  label,
  query,
  fields,
  resource,
  variables,
  operationName,
  generateGql,
  children,
  required,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  validate,
  placeholder,
  shouldUnregister,
  getOption = (record: any) => ({ value: record?.id, label: record?.id }),
  ...rest
}: SelectInputProps<TQuery, TData, TQueryData, TQueryVariables>) {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: source as any,
    control: (rest as any).control,
    rules: { required, min, max, maxLength, minLength, pattern, validate },
    shouldUnregister,
  })

  if (query) {
    return (
      <Query
        type="list"
        resource={resource}
        fields={fields}
        query={query}
        variables={variables}
        operationName={operationName}
      >
        <SelectWithEntries
          {...rest}
          placeholder={placeholder || label}
          name={name}
          color={value as string}
          ref={ref as any}
          value={(value as string) || ''}
          onChange={onChange}
          getOption={getOption}
        />
      </Query>
    )
  }

  return (
    <Select
      {...rest}
      placeholder={placeholder || label}
      name={name}
      color={value as string}
      ref={ref as any}
      value={(value as string) || ''}
      onChange={onChange}
      children={children}
    />
  )
}

const SelectWithEntries = React.forwardRef<
  any,
  SelectProps & {
    entries?: any[]
    getOption?: (record: any, index?: number) => { value: string; label: string }
    loading?: boolean
  }
>(({ loading, entries: entriesProps = [], getOption, children, ...props }, ref) => {
  const entries = useMemo(() => (entriesProps || []).map(getOption as any), [
    entriesProps,
    getOption,
  ])

  // if (loading) {
  //   return <Skeleton w="100%" h="40px" />
  // }
  return (
    <Select ref={ref as any} {...props}>
      {entries?.map((item: any, index) => {
        return (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        )
      })}
    </Select>
  )
})
