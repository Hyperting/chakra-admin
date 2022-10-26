import React, { FC, useCallback, useEffect, useState } from 'react'
// import {
//   CUIAutoComplete,
//   CUIAutoCompleteProps,
//   // CUIMultipleAutoComplete,
//   Item,
// } from 'chakra-ui-autocomplete'
import { UseComboboxStateChange } from 'downshift'
import { DocumentNode } from 'graphql'
import { Controller } from 'react-hook-form'
import { OperationVariables, useApolloClient } from '@apollo/client'
import { InputProps } from '../Input'
import { Item, CUIAutoCompleteProps, CUIAutoComplete } from '../../../chakra-ui-autocomplete'
import { useCreate } from '../../../core/details/useCreate'
import { CAInputProps } from 'ca-system'
import { ListProps } from '../../../core/list/ListProps'
import { EMPTY_QUERY, OffsetSortType, useGlobalStrategy, useGqlBuilder } from '../../../core'
import { useToast } from '@chakra-ui/react'
import { useMemo } from 'react'

export type AutocompleteInputProps<
  TQuery = Record<string, any>,
  TItem extends Record<string, any> = Record<string, any>,
  ListTData = any,
  ListTVariables = OperationVariables
> = Omit<InputProps, 'source' | 'onChange'> &
  Omit<CUIAutoCompleteProps<Item>, 'placeholder' | 'items' | 'onChange'> & {
    onChange?: (newValue: string, item: any) => void
    // value?: Item & { [x: string]: any }
    showEmptyState?: boolean
    createMutation?: DocumentNode
    inputValueToCreateVariables?: (inputValue: string) => Record<string, any>
    inputValueToFilters?: (value: string) => Record<string, any>
    emptyLabel?: string
    dataItemToAutocompleteItem?: (data: Record<string, any>, index: number) => Item & { [x: string]: any }
    filterResult?: (items: Item) => boolean
    resetList?: number

    // cursor paagination props
    first?: number
    last?: number
    revert?: boolean
    sortBy?: string

    // offset pagination props
    page?: number
    sort?: OffsetSortType<TItem>

    perPage?: number
  } & Omit<CAInputProps, 'onChange'> &
  Pick<ListProps, 'paginationMode' | 'query' | 'queryOptions' | 'resource' | 'basePath' | 'fields'>

export const Autocomplete: FC<AutocompleteInputProps> = React.forwardRef<any, AutocompleteInputProps>(
  (
    {
      resource,
      query,
      onChange,
      value,
      source,
      label,
      createMutation,
      placeholder,
      emptyLabel = 'All values',
      inputValueToFilters = (q: string) => ({ q }),
      dataItemToAutocompleteItem = (data) => ({ ...data, label: data.id, value: data.id }),
      showEmptyState = false,
      filterResult,
      resetList = 0,
      paginationMode = 'offset',
      first,
      last,
      revert,
      sortBy,
      sort,
      page,
      perPage,
      fields,
      ...rest
    },
    ref
  ) => {
    const [fetching, setFetching] = useState<boolean>(false)
    const strategy = useGlobalStrategy()
    const [items, setItems] = useState<(Item & { [x: string]: any })[]>(
      showEmptyState
        ? [
            {
              value: null,
              label: emptyLabel,
            } as any,
          ]
        : []
    )
    const [selectedItem, setSelectedItem] = useState<(Item & { [x: string]: any }) | undefined>()
    const notify = useToast()
    const client = useApolloClient()

    const variables = useMemo(() => {
      let preparedVars: any = {
        paginationMode,
        filters: inputValueToFilters(value),
        resource,
      }

      if (preparedVars.paginationMode === 'offset') {
        preparedVars = {
          ...preparedVars,
          sort,
          pagination: {
            perPage,
            page,
          },
        }
      } else {
        preparedVars = {
          ...preparedVars,
          sortBy,
          first,
          last,
          revert,
        }

        if (!preparedVars.first && !preparedVars.last) {
          preparedVars.first = 10
        }
      }

      return strategy?.list?.getVariables(preparedVars)
    }, [
      first,
      inputValueToFilters,
      last,
      page,
      paginationMode,
      perPage,
      resource,
      revert,
      sort,
      sortBy,
      strategy?.list,
      value,
    ])

    const { initialized, operation } = useGqlBuilder({
      resource,
      operation: query,
      type: 'query',
      generateGql: strategy?.list?.getQuery || (() => EMPTY_QUERY),
      variables,
      children: [],
      additionalFields: fields as string[],
    })

    const byIdsVariables = useMemo(() => {
      return strategy?.list?.getVariables({
        filters: {
          ids: value ? [value] : [],
        },
      } as any)
    }, [strategy?.list, value])

    const { operation: byIdsQuery } = useGqlBuilder({
      resource,
      operation: query,
      type: 'query',
      generateGql: strategy?.list?.getQuery || (() => EMPTY_QUERY),
      variables,
      children: [],
      additionalFields: fields as string[],
    })

    const handleSelectedItemChange = (changes: UseComboboxStateChange<Item>) => {
      if (changes.selectedItem && onChange) {
        onChange(changes.selectedItem.value, changes.selectedItem)
        // setSelectedItem(changes.selectedItem)
      }
      if (changes.selectedItem?.value === '' || changes.selectedItem?.value === null) {
        setSelectedItem(undefined)
      }
    }

    const handleFilters = useCallback(
      async (items: Item[], inputValue: string): Promise<Item[]> => {
        try {
          setFetching(true)
          console.log('inputValue', variables, inputValue, inputValueToFilters(inputValue))
          const result = await client.query({
            query: operation as any,
            variables: {
              ...variables,
              filters: inputValueToFilters(inputValue),
            },
          })

          if (result.error) {
            throw new Error('Error fetching data')
          }

          if (result.data) {
            let newData = (strategy?.list.getList(result as any, paginationMode) || []).map(dataItemToAutocompleteItem)

            if (filterResult) {
              newData = newData.filter(filterResult)
            }

            if (showEmptyState) {
              return [
                {
                  value: null,
                  label: emptyLabel,
                } as any,
                ...newData,
              ]
            }

            return newData
          } else if (showEmptyState) {
            return [
              {
                value: null,
                label: emptyLabel,
              } as any,
            ]
          } else {
            return []
          }

          // data && Object.keys(data).length > 0 && (data as any)[Object.keys(data)[0]]
          //   ? (data as any)[Object.keys(data)[0]].data
          //   : []
        } catch (error) {
          console.error('Error fetching filters')
          notify({
            status: 'error',
            title: "Can't fetch data",
            description: (error as any)?.message,
          })
        } finally {
          setFetching(false)
        }
        return []
      },
      [
        client,
        dataItemToAutocompleteItem,
        emptyLabel,
        filterResult,
        inputValueToFilters,
        notify,
        operation,
        paginationMode,
        showEmptyState,
        strategy?.list,
        variables,
      ]
    )

    useEffect(() => {
      const fetchData = async () => {
        try {
          setFetching(true)
          const result = await client.query({
            query: byIdsQuery as any,
            variables: byIdsVariables,
            fetchPolicy: 'network-only',
          })

          if (result.error) {
            throw new Error(`Error fetching data: ${result.error.message}`)
          }

          if (result.data) {
            const item = (strategy?.list?.getList(result as any, paginationMode) as any)?.[0]

            if (!item) {
              throw new Error('Error fetching data')
            }

            setSelectedItem(dataItemToAutocompleteItem(item, 0))
          }
        } catch (error) {
          console.error('Error fetching data', error)
          notify({
            status: 'error',
            title: "Can't fetch data",
            description: (error as any)?.message,
          })
        } finally {
          setFetching(false)
        }
      }

      if ((typeof value === 'string' && value === '0') || !value) {
        setSelectedItem({ value: '', label: '' })
      } else if (value && !fetching) {
        fetchData()
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
      const init = async () => {
        try {
          setFetching(true)
          const result = await client.query({
            query: operation as any,
            variables,
          })

          if (result.data) {
            const list = strategy?.list.getList(result as any, paginationMode) || []
            setItems(list.map(dataItemToAutocompleteItem) as any)
          }
        } catch (error) {
          console.error('Error fetching data', error)
          notify({
            status: 'error',
            title: "Can't fetch data",
            description: (error as any)?.message,
          })
        } finally {
          setFetching(false)
        }
      }

      if (!initialized) {
        return
      }

      init()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized])

    useEffect(() => {
      setItems([])
    }, [resetList])

    return (
      <CUIAutoComplete
        // ref={ref}
        label={label}
        optionFilterFunc={handleFilters as any}
        placeholder={placeholder || ''}
        items={items}
        labelStyleProps={{
          fontWeight: 'bold',
        }}
        selectedItem={selectedItem}
        onSelectedItemChange={handleSelectedItemChange}
        hideToggleButton
        {...rest}
      />
    )
  }
)

export const AutocompleteWithCreate: FC<AutocompleteInputProps> = ({
  resource,
  createMutation,
  inputValueToCreateVariables = ({ label }: any) => ({ name: label }),
  ...rest
}) => {
  const [creating, setIsCreating] = useState(false)
  const { onSubmit, executeMutation, mutationResult } = useCreate({
    resource,
    mutation: createMutation!,
    redirect: false,
  })

  const handleCreateItem = useCallback(
    (value: any) => {
      setIsCreating(true)
      onSubmit(inputValueToCreateVariables(value))
    },
    [onSubmit, inputValueToCreateVariables]
  )

  useEffect(() => {
    if (mutationResult?.data && creating) {
      setIsCreating(false)
      const keys = Object.keys(mutationResult.data)
      if (keys.length > 0 && (mutationResult.data as any)[keys[0]]) {
        if (rest?.onChange) {
          rest?.onChange((mutationResult.data as any)[keys[0]]?.id as any, (mutationResult.data as any)[keys[0]])
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creating, mutationResult?.data])

  return <Autocomplete onCreateItem={handleCreateItem} resource={resource} {...rest} />
}

export const AutocompleteInput: FC<AutocompleteInputProps> = ({
  required,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  validate,
  valueAsNumber,
  valueAsDate,
  value,
  setValueAs,
  shouldUnregister,
  onChange,
  onBlur,
  disabled,
  deps,
  register,
  control,
  ...props
}) => {
  if (control) {
    return (
      <Controller
        control={control}
        // defaultValue={true}
        name={props.source}
        rules={{
          deps,
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
          onBlur,
        }}
        render={({ field }) => {
          return props.createMutation ? (
            <AutocompleteWithCreate {...field} {...props} />
          ) : (
            <Autocomplete {...field} {...props} />
          )
        }}
      />
    )
  }

  return props.createMutation ? (
    <AutocompleteWithCreate onChange={onChange} value={value} {...props} />
  ) : (
    <Autocomplete onChange={onChange} value={value} {...props} />
  )
}
