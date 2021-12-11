/* eslint-disable @typescript-eslint/no-explicit-any */
import { OperationContext } from '@urql/core'
import { useCallback, useEffect, useMemo } from 'react'
import { useQuery, UseQueryArgs, UseQueryState } from 'urql'
import { useQueryString } from 'use-route-as-state'
import { ListProps } from './ListProps'
import { PaginationType } from './PaginationType'
import { SortType } from './SortType'

export const DEFAULT_LIMIT = 10
export const QP_LIMIT = 'limit'
export const QP_OFFSET = 'offset'
export const QP_SORT_PREFIX = 's_'
export const QP_FILTERS_PREFIX = 'f_'

export type UseListParams = ListProps & {}
export type UseListReturn<Data = object, Variables = any> = {
  refetch: (opts?: Partial<OperationContext>) => void
  onPaginationChange: (pagination: { limit: number; offset: number }) => void
  onSortChange: (sort: SortType<any>) => void
  onFiltersChange: (filters: Record<string, any>) => void
  pageCount: number
  currentSort: SortType<any>
  currentFilters: Record<string, any>
} & UseQueryState<Data, Variables> &
  PaginationType

/**
 * Hook that manage filtering and pagination for resources list QUERIES.
 * @param {UseListParams} params - all component props
 * @returns {UseListReturn} - use the result to render a custom ListView
 */
export const useList = <Data = object, Variables = any>({
  query,
  additionalTypenames,
}: UseListParams): UseListReturn<Data, Variables> => {
  const [queryState, setQueryState] = useQueryString({
    [QP_LIMIT]: `${DEFAULT_LIMIT}`,
    [QP_OFFSET]: '0',
  })

  const limit = useMemo(
    () =>
      queryState[QP_LIMIT] && !isNaN(queryState[QP_LIMIT] as any)
        ? parseInt(queryState[QP_LIMIT] as string, 10)
        : DEFAULT_LIMIT,
    [queryState]
  )

  const offset = useMemo(
    () =>
      queryState[QP_OFFSET] && !isNaN(queryState[QP_OFFSET] as any)
        ? parseInt(queryState[QP_OFFSET] as string, 10)
        : 0,
    [queryState]
  )

  const currentSort = useMemo<SortType<any>>(() => {
    const qpKeys = Object.keys(queryState)
    if (qpKeys.length > 0) {
      const foundedSortingKeys = qpKeys.filter((item) => item.startsWith(QP_SORT_PREFIX))
      if (foundedSortingKeys.length > 0) {
        return foundedSortingKeys.reduce((acc, item) => {
          return {
            ...acc,
            [item.substr(QP_SORT_PREFIX.length, item.length - 1)]: queryState[item],
          }
        }, {})
      }
    }
    return {}
  }, [queryState])

  const currentFilters = useMemo<Record<string, any>>(() => {
    const qpKeys = Object.keys(queryState)
    if (qpKeys.length > 0) {
      const foundedFiltersKeys = qpKeys.filter((item) => item.startsWith(QP_FILTERS_PREFIX))
      if (foundedFiltersKeys.length > 0) {
        return foundedFiltersKeys.reduce((acc, item) => {
          return {
            ...acc,
            [item.substr(QP_FILTERS_PREFIX.length, item.length - 1)]: queryState[item],
          }
        }, {})
      }
    }
    return {}
  }, [queryState])

  const context = useMemo(() => ({ additionalTypenames }), [additionalTypenames])

  const [result, refetch] = useQuery<Data, Variables>({
    query,
    context,
    requestPolicy: 'cache-and-network',
    variables: {
      pagination: {
        limit,
        offset,
      },
      sort: currentSort,
      filters: currentFilters,
    } as any,
  })

  const total = useMemo(() => {
    if (!result.fetching && result.data) {
      const dataKeys = Object.keys(result.data)
      if (
        dataKeys.length > 0 &&
        (result.data as any)[dataKeys[0]] &&
        (result.data as any)[dataKeys[0]].total
      ) {
        console.log('dentro total', (result.data as any)[dataKeys[0]].total)
        return (result.data as any)[dataKeys[0]].total
      }
    }

    return 0
  }, [result.data, result.fetching])

  const pageCount = useMemo(() => {
    const foundedMaxPage = Math.floor((total || 0) / (limit || DEFAULT_LIMIT))
    return total % limit === 0 ? foundedMaxPage : foundedMaxPage + 1
  }, [limit, total])

  const onPaginationChange = useCallback(
    ({ limit, offset }: { limit: number; offset: number }) => {
      setQueryState((prevState) => ({
        ...prevState,
        [QP_LIMIT]: `${limit}`,
        [QP_OFFSET]: `${offset}`,
      }))
    },
    [setQueryState]
  )

  const onSortChange = useCallback(
    (sort: SortType<any>) => {
      const newSort = Object.keys(sort).reduce((acc, key) => {
        return {
          ...acc,
          [QP_SORT_PREFIX + key]: sort[key],
        }
      }, {})
      setQueryState((prevState) => {
        const prevStateKeys = Object.keys(prevState)
        if (prevStateKeys.length > 0) {
          const filteredPrevState = prevStateKeys.reduce((acc, item) => {
            if (item.startsWith(QP_SORT_PREFIX)) {
              return { ...acc }
            }
            return {
              ...acc,
              [item]: prevState[item],
            }
          }, {})

          return { ...filteredPrevState, ...newSort }
        }
        return { ...newSort }
      })
    },
    [setQueryState]
  )

  const onFiltersChange = useCallback(
    (filters: Record<string, any>) => {
      const newFilters = Object.keys(filters).reduce((acc, key) => {
        if (filters[key] && typeof filters[key] !== 'number') {
          return {
            ...acc,
            [QP_FILTERS_PREFIX + key]: filters[key],
          }
        }

        return {
          ...acc,
        }
      }, {})
      setQueryState((prevState) => {
        const prevStateKeys = Object.keys(prevState)
        if (prevStateKeys.length > 0) {
          const filteredPrevState = prevStateKeys.reduce((acc, item) => {
            if (item.startsWith(QP_FILTERS_PREFIX)) {
              return { ...acc }
            }
            return {
              ...acc,
              [item]: prevState[item],
            }
          }, {})

          return { ...filteredPrevState, ...newFilters, offset: '0' }
        }
        return { ...newFilters, offset: '0' }
      })
    },
    [setQueryState]
  )

  // useEffect(() => {
  //   if (defaultSorting && Object.keys(defaultSorting).length > 0) {
  //     setQueryState((prevState) => ({
  //       ...prevState,
  //       ...Object.keys(defaultSorting).reduce((acc, key) => {
  //         return { ...acc, [QP_SORT_PREFIX + key]: defaultSorting[key] }
  //       }, {}),
  //     }))
  //   }
  // }, [])

  return {
    ...result,
    refetch,
    onPaginationChange,
    onSortChange,
    onFiltersChange,
    limit,
    offset,
    total,
    pageCount: pageCount || 0,
    currentSort,
    currentFilters,
  }
}
