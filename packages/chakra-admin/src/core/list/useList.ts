/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult, gql, OperationVariables, QueryResult, useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo } from 'react'
import { ListGetVariablesParams } from '../admin'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'
import { useVersionStateValue } from '../admin/versionState'
import { useGqlBuilder } from '../graphql/gql-builder'
import { ListProps, PaginationMode } from './ListProps'
import { SortType } from './SortType'
import { useSearchParamsAsState } from './useSearchParamsAsState'

export const DEFAULT_PER_PAGE = 20
export const QP_PER_PAGE = 'l'
export const QP_PAGE = 'p'
export const QP_AFTER = 'a'
export const QP_BEFORE = 'b'
export const QP_FIRST = 'f'
export const QP_LAST = 'l'
export const QP_REVERT = 'r'
export const QP_SORT_PREFIX = 's_'
export const QP_FILTERS_PREFIX = 'f_'

const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`

export type BaseListPagination = {
  paginationMode: PaginationMode
  pageCount?: number
  total?: number
}

export type OffsetOnPageChangeParams = {
  page: number
  perPage: number
}
export type OffsetOnPageChange = (params: OffsetOnPageChangeParams) => void

export type CursorOnPageChangeParams = {
  after?: string
  before?: string
  first?: number
  last?: number
  revert?: boolean
}
export type CursorOnPageChange = (params: CursorOnPageChangeParams) => void

export type OnPageChangeParams = OffsetOnPageChangeParams | CursorOnPageChangeParams
export type OnPageChange = OffsetOnPageChange | CursorOnPageChange

export type OffsetPagination = BaseListPagination & {
  paginationMode: 'offset'
  page: number
  perPage: number
  onPageChange: OffsetOnPageChange
}

export type CursorPagination = BaseListPagination & {
  paginationMode: 'cursor'
  after?: string
  before?: string
  first?: number
  last?: number
  revert?: boolean
  onPageChange: CursorOnPageChange
  /**
   * a table could need to know in wich page it is to display pagination
   */
  page?: number
}

export type ListPagination = OffsetPagination | CursorPagination

export type UseListParams<
  TQuery = Record<string, any>,
  TItem = Record<string, any>,
  ListTData = any,
  ListTVariables = OperationVariables,
  DeleteTData = any,
  DeleteTVariables = OperationVariables
> = ListProps<TQuery, TItem, ListTData, ListTVariables, DeleteTData, DeleteTVariables> & {}

export type UseListReturn<TItem = Record<string, any>, TData = any, TVariables = OperationVariables> = {
  refetch: (variables?: Partial<TVariables> | undefined) => Promise<ApolloQueryResult<TData>>
  onSortChange: (sort: SortType<any>) => void
  onFiltersChange: (filters: Record<string, any>) => void
  currentSort: SortType<any>
  currentFilters: Record<string, any>
  queryResult: QueryResult<TData, TVariables>
  list: TItem[]
} & ListPagination &
  QueryResult<TData, TVariables>

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
  paginationMode = 'offset',
  defaultPerPage = DEFAULT_PER_PAGE,
  resource,
  query,
  queryOptions,
  defaultFilters,
  defaultSorting,
  fields,
  children,
  refetchOnDefaultFiltersChange,
}: UseListParams<TQuery, TItem, ListTData, ListTVariables, DeleteTData, DeleteTVariables>): UseListReturn<
  TItem,
  ListTData,
  ListTVariables
> => {
  const version = useVersionStateValue()
  const strategy = useGlobalStrategy()

  const [params, setParams] = useSearchParamsAsState()

  const perPage = useMemo(() => {
    return paginationMode === 'offset'
      ? params[QP_PER_PAGE] && !isNaN(params[QP_PER_PAGE] as any)
        ? parseInt(params[QP_PER_PAGE] as string, 10)
        : defaultPerPage
      : undefined
  }, [defaultPerPage, paginationMode, params])

  const page = useMemo(() => {
    return paginationMode === 'offset'
      ? params[QP_PAGE] && !isNaN(params[QP_PAGE] as any)
        ? parseInt(params[QP_PAGE] as string, 10)
        : 1
      : undefined
  }, [paginationMode, params])

  const after = useMemo(() => {
    return paginationMode === 'cursor' ? (params[QP_AFTER] ? (params[QP_AFTER] as string) : undefined) : undefined
  }, [paginationMode, params])

  const before = useMemo(() => {
    return paginationMode === 'cursor' ? (params[QP_BEFORE] ? (params[QP_BEFORE] as string) : undefined) : undefined
  }, [paginationMode, params])

  const first = useMemo(() => {
    return paginationMode === 'cursor'
      ? params[QP_FIRST] && !isNaN(params[QP_FIRST] as any)
        ? parseInt(params[QP_FIRST] as string, 10)
        : undefined
      : undefined
  }, [paginationMode, params])

  const last = useMemo(() => {
    return paginationMode === 'cursor'
      ? params[QP_LAST] && !isNaN(params[QP_LAST] as any)
        ? parseInt(params[QP_LAST] as string, 10)
        : undefined
      : undefined
  }, [paginationMode, params])

  const revert = useMemo(() => {
    return paginationMode === 'cursor'
      ? params[QP_REVERT]
        ? (params[QP_REVERT] as string) === 'true'
        : false
      : undefined
  }, [paginationMode, params])

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
            if (!params[item]) {
              return { ...acc }
            }

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
    let preparedVars: ListGetVariablesParams = {
      paginationMode,
      filters: currentFilters,
      resource,
    } as ListGetVariablesParams

    if (preparedVars.paginationMode === 'offset') {
      preparedVars = {
        ...preparedVars,
        sort: currentSort,
        pagination: {
          perPage,
          page,
        },
      }
    } else {
      preparedVars = {
        ...preparedVars,
        after,
        before,
        first,
        last,
        revert,
      }
    }

    return strategy?.list?.getVariables(preparedVars) as ListTVariables
  }, [
    paginationMode,
    currentFilters,
    resource,
    strategy?.list,
    currentSort,
    perPage,
    page,
    after,
    before,
    first,
    last,
    revert,
  ])

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
    variables: { ...variables },
    ...(queryOptions || {}),
    skip: queryOptions?.skip ? !initialized || !operation || queryOptions.skip : !initialized || !operation,
  })

  const total = useMemo(() => {
    if (!result.loading && result.data) {
      return strategy?.list.getTotal(result as any, paginationMode) || (paginationMode === 'offset' ? 0 : undefined)
    }

    return 0
  }, [paginationMode, result, strategy?.list])

  const list = useMemo<TItem[]>(() => {
    if (!result.loading && result.data) {
      return (strategy?.list.getList(result as any, paginationMode) || []) as TItem[]
    }

    return []
  }, [paginationMode, result, strategy?.list])

  const pageCount = useMemo(() => {
    if (paginationMode === 'offset' || total) {
      const foundedMaxPage = Math.floor((total || 0) / (perPage || defaultPerPage))
      return (total || 0) % (perPage || defaultPerPage) === 0 ? foundedMaxPage : foundedMaxPage + 1
    }

    return undefined
  }, [defaultPerPage, paginationMode, perPage, total])

  const onPageChange = useCallback<OnPageChange>(
    (params) => {
      if (paginationMode === 'offset') {
        setParams({
          ...params,
          [QP_PAGE]: params.page,
          [QP_PER_PAGE]: params.perPage,
        })
      } else {
        setParams({
          ...params,
          [QP_AFTER]: params.after,
          [QP_BEFORE]: params.before,
          [QP_FIRST]: params.first,
          [QP_LAST]: params.last,
          [QP_REVERT]: params.revert,
        })
      }
    },
    [paginationMode, setParams]
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

  const baseReturn = {
    ...result,
    queryResult: result,
    refetch: result.refetch,
    onPageChange: onPageChange as any,
    onSortChange,
    onFiltersChange,
    total,
    pageCount,
    currentSort,
    currentFilters,
    list,
  }

  if (paginationMode === 'offset') {
    return {
      ...baseReturn,
      paginationMode: 'offset',
      perPage: perPage || defaultPerPage,
      page: page || 1,
    }
  } else {
    return {
      ...baseReturn,
      paginationMode: 'cursor',
      after,
      before,
      first,
      last,
      revert,
    }
  }
}
