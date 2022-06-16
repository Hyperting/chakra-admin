/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult, gql, OperationVariables, QueryResult, useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo } from 'react'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'
import { useVersionStateValue } from '../admin/versionState'
import { useGqlBuilder } from '../graphql/gql-builder'
import { ListProps } from './ListProps'
import { PaginationType } from './PaginationType'
import { SortType } from './SortType'
import { useSearchParamsAsState } from './useSearchParamsAsState'

export const DEFAULT_LIMIT = 10
export const QP_LIMIT = 'limit'
export const QP_OFFSET = 'offset'
export const QP_SORT_PREFIX = 's_'
export const QP_FILTERS_PREFIX = 'f_'

const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`

export type UseListParams<
  TQuery = Record<string, any>,
  TItem = Record<string, any>,
  ListTData = any,
  ListTVariables = OperationVariables,
  DeleteTData = any,
  DeleteTVariables = OperationVariables
> = ListProps<TQuery, TItem, ListTData, ListTVariables, DeleteTData, DeleteTVariables> & {}

export type UseListReturn<TData = any, TVariables = OperationVariables> = {
  refetch: (variables?: Partial<TVariables> | undefined) => Promise<ApolloQueryResult<TData>>
  onPaginationChange: (pagination: { limit: number; offset: number }) => void
  onSortChange: (sort: SortType<any>) => void
  onFiltersChange: (filters: Record<string, any>) => void
  pageCount: number
  currentSort: SortType<any>
  currentFilters: Record<string, any>
  queryResult: QueryResult<TData, TVariables>
} & QueryResult<TData, TVariables> &
  PaginationType

/**
 * Hook that manage filtering and pagination for resources list QUERIES.
 * @param {UseListParams} params - all component props
 * @returns {UseListReturn} - use the result to render a custom ListView
 */
export const useList = <
  TQuery = Record<string, any>,
  TItem = Record<string, any>,
  ListTData = any,
  ListTVariables = OperationVariables,
  DeleteTData = any,
  DeleteTVariables = OperationVariables
>({
  resource,
  query,
  queryOptions,
  defaultFilters,
  defaultSorting,
  fields,
  children,
  refetchOnDefaultFiltersChange,
}: UseListParams<
  TQuery,
  TItem,
  ListTData,
  ListTVariables,
  DeleteTData,
  DeleteTVariables
>): UseListReturn<ListTData, ListTVariables> => {
  const version = useVersionStateValue()
  const strategy = useGlobalStrategy()

  const [params, setParams] = useSearchParamsAsState({
    [QP_LIMIT]: `${DEFAULT_LIMIT}`,
    [QP_OFFSET]: '0',
  })

  const limit = useMemo(() => {
    return params[QP_LIMIT] && !isNaN(params[QP_LIMIT] as any)
      ? parseInt(params[QP_LIMIT] as string, 10)
      : DEFAULT_LIMIT
  }, [params])

  const offset = useMemo(() => {
    return params[QP_OFFSET] && !isNaN(params[QP_OFFSET] as any)
      ? parseInt(params[QP_OFFSET] as string, 10)
      : 0
  }, [params])

  const currentSort = useMemo<SortType<any>>(() => {
    const qpKeys = Object.keys(params)
    if (qpKeys.length > 0) {
      const foundedSortingKeys = qpKeys.filter((item) => item.startsWith(QP_SORT_PREFIX))
      if (foundedSortingKeys.length > 0) {
        return {
          ...(defaultSorting || {}),
          ...(foundedSortingKeys || []).reduce((acc, item) => {
            return {
              ...acc,
              [item.substr(QP_SORT_PREFIX.length, item.length - 1)]: params[item],
            }
          }, {}),
        }
      }
    }
    return {
      ...(defaultSorting || {}),
    }
  }, [defaultSorting, params])

  const currentFilters = useMemo<Record<string, any>>(() => {
    const qpKeys = Object.keys(params)
    if (qpKeys.length > 0) {
      const foundedFiltersKeys = qpKeys.filter((item) => item.startsWith(QP_FILTERS_PREFIX))
      if (foundedFiltersKeys.length > 0) {
        return {
          ...(defaultFilters || {}),
          ...foundedFiltersKeys.reduce((acc, item) => {
            return {
              ...acc,
              [item.substr(QP_FILTERS_PREFIX.length, item.length - 1)]: params[item],
            }
          }, {}),
        }
      }
    }
    return {
      ...(defaultFilters || {}),
    }
  }, [defaultFilters, params])

  const variables = useMemo(() => {
    return strategy?.list?.getVariables(
      {
        filters: currentFilters,
        pagination: {
          first: limit,
          after: offset,
        },
        sort: currentSort,
      },
      resource!
    ) as ListTVariables
  }, [currentFilters, currentSort, limit, offset, resource, strategy?.list])

  const { initialized, operation, selectionSet } = useGqlBuilder({
    resource,
    operation: query,
    type: 'query',
    generateGql: strategy?.list?.getQuery || (() => EMPTY_QUERY),
    variables,
    children,
    additionalFields: fields as string[],
  })

  const result = useQuery<ListTData, ListTVariables>(operation as any, {
    variables,
    ...(queryOptions || {}),
    skip: queryOptions?.skip
      ? !initialized || !operation || queryOptions.skip
      : !initialized || !operation,
  })

  const total = useMemo(() => {
    if (!result.loading && result.data) {
      return strategy?.list.getTotal(result) || 0
    }

    return 0
  }, [result, strategy?.list])

  const pageCount = useMemo(() => {
    const foundedMaxPage = Math.floor((total || 0) / (limit || DEFAULT_LIMIT))
    return total % (limit || 0) === 0 ? foundedMaxPage : foundedMaxPage + 1
  }, [limit, total])

  const onPaginationChange = useCallback(
    ({ limit, offset }: { limit: number; offset: number }) => {
      setParams({
        ...params,
        [QP_LIMIT]: `${limit}`,
        [QP_OFFSET]: `${offset}`,
      })
    },
    [setParams, params]
  )

  const onSortChange = useCallback(
    (sort: SortType<any>) => {
      const newSort = Object.keys(sort).reduce((acc, key) => {
        return {
          ...acc,
          [QP_SORT_PREFIX + key]: sort[key],
        }
      }, {})
      setParams(
        ((prevState) => {
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
        })(params)
      )
    },
    [params, setParams]
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
      setParams(
        ((prevState) => {
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
        })(params)
      )
    },
    [setParams, params]
  )

  useEffect(() => {
    if (result?.refetch) {
      result.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  // useEffect(() => {
  //   if (!limit && !offset && Object.keys(params).length === 0) {
  //     setParams({
  //       ...params,
  //       [QP_LIMIT]: `${DEFAULT_LIMIT}`,
  //       [QP_OFFSET]: '0',
  //     })
  //   }
  // }, [])

  useEffect(() => {
    if (refetchOnDefaultFiltersChange) {
      result.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilters])

  return {
    ...result,
    queryResult: result,
    refetch: result.refetch,
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
