import React, { FC, useCallback, useEffect, useState } from 'react'
// import {
//   CUIAutoComplete,
//   CUIAutoCompleteProps,
//   // CUIMultipleAutoComplete,
//   Item,
// } from 'chakra-ui-autocomplete'
import { UseComboboxStateChange } from 'downshift'
import { DocumentNode } from 'graphql'
import { useToast } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { useApolloClient } from '@apollo/client'
import { InputProps } from '../Input'
import { Item, CUIAutoCompleteProps, CUIAutoComplete } from '../../../chakra-ui-autocomplete'
import { useCreate } from '../../../core/details/useCreate'
import { CAInputProps } from 'ca-system'

export type AutocompleteInputProps = Omit<InputProps, 'source' | 'onChange'> &
  Omit<CUIAutoCompleteProps<Item>, 'placeholder' | 'items' | 'onChange'> & {
    onChange?: (newValue: string, item: any) => void
    // value?: Item & { [x: string]: any }

    showEmptyState?: boolean
    query: DocumentNode
    createMutation?: DocumentNode
    inputValueToCreateVariables?: (inputValue: string) => Record<string, any>
    inputValueToFilters?: (value: string) => Record<string, any>
    emptyLabel?: string
    dataItemToAutocompleteItem?: (data: Record<string, any>, index: number) => Item & { [x: string]: any }
    filterResult?: (items: Item) => boolean
    resetList?: number
  } & Omit<CAInputProps, 'onChange'>

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
      ...rest
    },
    ref
  ) => {
    const [fetching, setFetching] = useState<boolean>(false)
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
          const { data, error } = await client.query({
            query,
            variables: {
              filters: inputValueToFilters(inputValue),
            },
          })

          if (error) {
            throw new Error('Error fetching data')
          }

          if (
            data &&
            Object.keys(data).length > 0 &&
            (data as any)[Object.keys(data)[0]] &&
            (data as any)[Object.keys(data)[0]].data?.length > 0
          ) {
            let newData = (data as any)[Object.keys(data)[0]].data.map(dataItemToAutocompleteItem)

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
      [client, dataItemToAutocompleteItem, emptyLabel, filterResult, inputValueToFilters, notify, query, showEmptyState]
    )

    useEffect(() => {
      const fetchData = async () => {
        try {
          setFetching(true)
          const { data, error } = await client.query({
            query,
            variables: {
              filters: {
                ids: [value],
              },
            },
            fetchPolicy: 'network-only',
          })

          if (error) {
            throw new Error(`Error fetching data: ${error.message}`)
          }

          if (data) {
            const dataKeys = Object.keys(data)
            if (
              dataKeys.length > 0 &&
              (data as any)[dataKeys[0]] &&
              (data as any)[dataKeys[0]].data &&
              (data as any)[dataKeys[0]].data.length > 0
            ) {
              const foundedItem = (data as any)[dataKeys[0]].data.find(
                (unknownData: any) => dataItemToAutocompleteItem(unknownData, 0).value === value
              )

              setSelectedItem(dataItemToAutocompleteItem(foundedItem, 0))
            }
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
      } else if (value) {
        fetchData()
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
      const init = async () => {
        try {
          setFetching(true)
          const { data } = await client.query({
            query,
            variables: { filters: inputValueToFilters('') },
          })

          if (data) {
            const dataKeys = Object.keys(data)
            if (
              dataKeys.length > 0 &&
              (data as any)[dataKeys[0]] &&
              (data as any)[dataKeys[0]].data &&
              (data as any)[dataKeys[0]].data.length > 0
            ) {
              setItems([...(data as any)[Object.keys(data)[0]].data.map(dataItemToAutocompleteItem)])
            } else {
              // throw new Error('Error fetching data')
            }
          }

          // data && Object.keys(data).length > 0 && (data as any)[Object.keys(data)[0]]
          //   ? (data as any)[Object.keys(data)[0]].data
          //   : []
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

      init()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
