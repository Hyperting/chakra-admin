import React, { ChangeEventHandler, useCallback, useMemo } from 'react'
import { Select, SelectProps } from '@chakra-ui/react'
import { OperationVariables } from '@apollo/client'
import { Controller, useController } from 'react-hook-form'
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
    showEmpty?: boolean
    emptyLabel?: string
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
  register,
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
  value,
  showEmpty = true,
  emptyLabel = '',
  control,
  ...rest
}: SelectInputProps<TQuery, TData, TQueryData, TQueryVariables> & Record<string, any>) {
  // const {
  //   // field: { onChange, onBlur, name, value, ref },
  //   // fieldState: { invalid, isTouched, isDirty },
  //   // formState: { touchedFields, dirtyFields },
  // } = useController({
  //   name: source as any,
  //   control: (rest as any).control,
  //   rules: { required, min, max, maxLength, minLength, pattern, validate },
  //   shouldUnregister,
  // })

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      if (onChangeProp) {
        onChangeProp(event.target.value)
      }
    },
    [onChangeProp]
  )

  if (query) {
    return (
      <>
        {control ? (
          <Controller
            control={control}
            // defaultValue={true}
            name={source as any}
            shouldUnregister={shouldUnregister}
            rules={{
              required,
              min,
              max,
              maxLength,
              minLength,
              pattern,
              validate,
              value,
              shouldUnregister,
              // onChange,
            }}
            render={({ field }) => {
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
                    {...(field as any)}
                    placeholder={placeholder || label}
                    color={value as string}
                    getOption={getOption}
                    showEmpty={showEmpty}
                    emptyLabel={emptyLabel}
                  />
                </Query>
              )
            }}
          />
        ) : (
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
              color={value as string}
              // value={(value as string) || ''}
              // onChange={onChange}
              value={value || ''}
              onChange={handleChange}
              getOption={getOption}
              showEmpty={showEmpty}
              emptyLabel={emptyLabel}
            />
          </Query>
        )}
      </>
    )
  }

  if (control) {
    return (
      <Controller
        control={control}
        // defaultValue={true}
        name={source as any}
        rules={{
          required,
          min,
          max,
          maxLength,
          minLength,
          pattern,
          validate,
          value,
          shouldUnregister,
          // onChange,
        }}
        render={({ field }) => {
          return <Select {...(field as any)} {...rest} />
        }}
      />
    )
  }

  return (
    <Select
      {...rest}
      placeholder={placeholder || label}
      color={value as string}
      // ref={ref as any}
      value={(value as string) || ''}
      onChange={onChangeProp}
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
    showEmpty?: boolean
    emptyLabel?: string
  }
>(
  (
    { loading, entries: entriesProps = [], getOption, children, showEmpty, emptyLabel, ...props },
    ref
  ) => {
    const entries = useMemo(() => (entriesProps || []).map(getOption as any), [
      entriesProps,
      getOption,
    ])

    // if (loading) {
    //   return <Skeleton w="100%" h="40px" />
    // }
    return (
      <Select ref={ref as any} {...props}>
        {showEmpty && <option value="">{emptyLabel}</option>}
        {entries?.map((item: any, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </Select>
    )
  }
)
