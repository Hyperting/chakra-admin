import React, { ChangeEventHandler, FC, useCallback, useEffect, useState } from 'react'
// import {
//   CUIAutoComplete,
//   CUIAutoCompleteProps,
//   // CUIMultipleAutoComplete,
//   Item,
// } from 'chakra-ui-autocomplete'
import { UseComboboxStateChange } from 'downshift'
import { DocumentNode } from 'graphql'
import { TypedDocumentNode, useClient, useQuery } from 'urql'
import { useToast } from '@chakra-ui/toast'
import { chakra } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { InputProps } from '../Input'
import { Item, CUIAutoCompleteProps, CUIAutoComplete } from '../../../chakra-ui-autocomplete'

export type AutocompleteInputProps = InputProps &
  Omit<CUIAutoCompleteProps<Item>, 'placeholder' | 'items'> & {
    // onChange?: (newValue: Item & { [x: string]: any }) => void
    // value?: Item & { [x: string]: any }

    query: string | DocumentNode | TypedDocumentNode<{}, any>
    inputValueToFilters?: (value: string) => Record<string, any>
    emptyLabel?: string
    dataItemToAutocompleteItem?: (
      data: Record<string, any>,
      index: number
    ) => Item & { [x: string]: any }
  }

export const AutocompleteInput: FC<AutocompleteInputProps> = React.forwardRef<
  any,
  AutocompleteInputProps
>(
  (
    {
      query,
      onChange,
      value,
      source,
      label,
      placeholder,
      emptyLabel = 'All values',
      inputValueToFilters = (q: string) => ({ q }),
      dataItemToAutocompleteItem = (data) => ({ ...data, label: data.id, value: data.id }),
      ...rest
    },
    ref
  ) => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [items, setItems] = useState<(Item & { [x: string]: any })[]>([
      {
        value: '',
        label: emptyLabel,
      },
    ])
    const [selectedItem, setSelectedItem] = useState<(Item & { [x: string]: any }) | undefined>()
    const notify = useToast()
    const client = useClient()

    const handleSelectedItemChange = (changes: UseComboboxStateChange<Item>) => {
      if (changes.selectedItem && onChange) {
        onChange(changes.selectedItem.value)
        // setSelectedItem(changes.selectedItem)
      }
      if (changes.selectedItem?.value === '') {
        setSelectedItem(undefined)
      }
    }

    const handleFilters = useCallback(
      async (items: Item[], inputValue: string): Promise<Item[]> => {
        try {
          setFetching(true)
          const { data, error } = await client
            .query(query, {
              filters: inputValueToFilters(inputValue),
            })
            .toPromise()

          if (error) {
            throw new Error('Error fetching data')
          }

          if (
            data &&
            Object.keys(data).length > 0 &&
            (data as any)[Object.keys(data)[0]] &&
            (data as any)[Object.keys(data)[0]].data
          ) {
            return [
              {
                value: '',
                label: emptyLabel,
              },
              ...(data as any)[Object.keys(data)[0]].data.map(dataItemToAutocompleteItem),
            ]
          } else {
            return [
              {
                value: '',
                label: emptyLabel,
              },
            ]
          }

          // data && Object.keys(data).length > 0 && (data as any)[Object.keys(data)[0]]
          //   ? (data as any)[Object.keys(data)[0]].data
          //   : []
        } catch (error) {
          console.error('Error fetching filters')
          notify({
            status: 'error',
            title: "Can't fetch data",
            description: error.message,
          })
        } finally {
          setFetching(false)
        }
        return []
      },
      [client, dataItemToAutocompleteItem, emptyLabel, inputValueToFilters, notify, query]
    )

    useEffect(() => {
      const fetchData = async () => {
        try {
          setFetching(true)
          const { data, error } = await client
            .query(query, {
              filters: {
                ids: [value],
              },
            })
            .toPromise()

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
              const foundedItem = (data as any)[dataKeys[0]].data[0]
              setSelectedItem(dataItemToAutocompleteItem(foundedItem, 0))
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
            description: error.message,
          })
        } finally {
          setFetching(false)
        }
      }

      if (value) {
        fetchData()
      } else if (typeof value === 'string' && value === '0') {
        setSelectedItem(undefined)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
      const init = async () => {
        try {
          setFetching(true)
          const { data } = await client.query(query).toPromise()

          if (data) {
            const dataKeys = Object.keys(data)
            if (
              dataKeys.length > 0 &&
              (data as any)[dataKeys[0]] &&
              (data as any)[dataKeys[0]].data &&
              (data as any)[dataKeys[0]].data.length > 0
            ) {
              setItems([
                ...(data as any)[Object.keys(data)[0]].data.map(dataItemToAutocompleteItem),
              ])
            } else {
              throw new Error('Error fetching data')
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
            description: error.message,
          })
        } finally {
          setFetching(false)
        }
      }

      init()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <chakra.div mt={5}>
        {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
        <CUIAutoComplete
          ref={ref}
          label={label}
          optionFilterFunc={handleFilters as any}
          placeholder={placeholder || ''}
          // onCreateItem={handleCreateItem}
          items={items}
          labelStyleProps={{
            fontWeight: 'bold',
          }}
          selectedItem={selectedItem}
          onSelectedItemChange={handleSelectedItemChange}
          disableCreateItem
          hideToggleButton
          {...rest}
        />
      </chakra.div>
    )
  }
)

export const AutocompleteControlInput: FC<AutocompleteInputProps> = (props) => {
  if (props.control) {
    return (
      <Controller
        control={props.control}
        defaultValue={true}
        name={props.source}
        render={({ field }) => <AutocompleteInput {...field} {...props} />}
      />
    )
  }

  return <AutocompleteInput {...props} />
}
