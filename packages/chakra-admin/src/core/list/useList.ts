/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult, gql, OperationVariables, QueryResult, useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo } from 'react'
import { ListGetVariablesParams, PageInfo } from '../admin'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'
import { useVersionStateValue } from '../admin/versionState'
import { useGqlBuilder } from '../graphql/gql-builder'
import { ListProps, PaginationMode } from './ListProps'
import { OffsetSortType } from './SortType'
import { useSearchParamsAsState } from './useSearchParamsAsState'

export const DEFAULT_PER_PAGE = 20
export const QP_PER_PAGE = 'l'
export const QP_PAGE = 'p'
export const QP_AFTER = 'a'
export const QP_BEFORE = 'b'
export const QP_FIRST = 'f'
export const QP_LAST = 'l'
export const QP_REVERT = 'r'
export const QP_SORT_BY = 's'
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
  sortBy?: string
}
export type CursorOnPageChange = (params: CursorOnPageChangeParams) => void

export type OnPageChangeParams = OffsetOnPageChangeParams | CursorOnPageChangeParams
export type OnPageChange = OffsetOnPageChange | CursorOnPageChange

export type OffsetOnSortChange<TItem extends Record<string, any> = Record<string, any>> = (
  sort: OffsetSortType<TItem>,
) => void

export type CursorsOnSortChangeParams<TItem extends Record<string, any> = Record<string, any>> = {
  sortBy?: keyof TItem | string
  revert?: boolean
  first?: number
  last?: number
}
export type CursorOnSortChange<TItem extends Record<string, any> = Record<string, any>> = (
  sort: CursorsOnSortChangeParams<TItem>,
) => void

export type OnSortChange = OffsetOnSortChange | CursorOnSortChange

export type OffsetPagination = BaseListPagination & {
  paginationMode: 'offset'
  page: number
  perPage: number
  onPageChange: OffsetOnPageChange
  currentSort: OffsetSortType<any>
  onSortChange: OffsetOnSortChange
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
  currentSortBy?: string
  onSortChange: CursorOnSortChange
}

export type PaginatedList = OffsetPagination | CursorPagination

export type UseListParams<
  TQuery = Record<string, any>,
  TItem extends Record<string, any> = Record<string, any>,
  ListTData = any,
  ListTVariables = OperationVariables,
  DeleteTData = any,
  DeleteTVariables = OperationVariables,
> = ListProps<TQuery, TItem, ListTData, ListTVariables, DeleteTData, DeleteTVariables> & {}

export type UseListReturn<TItem = Record<string, any>, TData = any, TVariables = OperationVariables> = {
  refetch: (variables?: Partial<TVariables> | undefined) => Promise<ApolloQueryResult<TData>>
  onFiltersChange: (filters: Record<string, any>) => void
  currentFilters: Record<string, any>
  queryResult: QueryResult<TData, TVariables>
  list: TItem[]
  pageInfo?: PageInfo
} & PaginatedList &
  QueryResult<TData, TVariables>

/**
 * Hook that manage filtering and pagination for resources list QUERIES.
 * @param {UseListParams} params - all component props
 * @returns {UseListReturn} - use the result to render a custom ListView
 */
export const useList = <
  TQuery = Record<string, any>,
  TItem extends Record<string, any> = Record<string, any>,
  ListTData = any,
  ListTVariables = OperationVariables,
  DeleteTData = any,
  DeleteTVariables = OperationVariables,
>({
  paginationMode = 'offset',
  defaultPerPage = DEFAULT_PER_PAGE,
  resource,
  query,
  queryOptions,
  defaultFilters,
  defaultSort,
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
    if (params[QP_PAGE] && !isNaN(params[QP_PAGE] as any)) {
      return parseInt(params[QP_PAGE] as string, 10)
    }

    return paginationMode === 'offset' ? 1 : undefined
  }, [paginationMode, params])

  const after = useMemo(() => {
    return paginationMode === 'cursor' ? (params[QP_AFTER] ? (params[QP_AFTER] as string) : undefined) : undefined
  }, [paginationMode, params])

  const before = useMemo(() => {
    return paginationMode === 'cursor' ? (params[QP_BEFORE] ? (params[QP_BEFORE] as string) : undefined) : undefined
  }, [paginationMode, params])

  const last = useMemo(() => {
    return paginationMode === 'cursor'
      ? params[QP_LAST] && !isNaN(params[QP_LAST] as any)
        ? parseInt(params[QP_LAST] as string, 10)
        : undefined
      : undefined
  }, [paginationMode, params])

  const defaultFirst = useMemo(() => {
    return paginationMode === 'cursor' ? (last ? undefined : defaultPerPage) : undefined
  }, [defaultPerPage, last, paginationMode])

  const first = useMemo(() => {
    return paginationMode === 'cursor'
      ? params[QP_FIRST] && !isNaN(params[QP_FIRST] as any)
        ? parseInt(params[QP_FIRST] as string, 10)
        : defaultFirst
      : undefined
  }, [defaultFirst, paginationMode, params])

  const revert = useMemo(() => {
    return paginationMode === 'cursor'
      ? params[QP_REVERT]
        ? (params[QP_REVERT] as string) === 'true'
        : false
      : undefined
  }, [paginationMode, params])

  const currentSort = useMemo<OffsetSortType<any> | undefined>(() => {
    if (paginationMode === 'cursor') {
      return undefined
    }

    const qpKeys = Object.keys(params)
    if (qpKeys.length > 0) {
      const foundedSortingKeys = qpKeys.filter((item) => item.startsWith(QP_SORT_PREFIX))
      if (foundedSortingKeys.length > 0) {
        return {
          ...(defaultSort || defaultSorting || {}),
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
      ...(defaultSort || defaultSorting || {}),
    }
  }, [defaultSort, defaultSorting, paginationMode, params])

  const currentSortBy = useMemo<string | undefined>(() => {
    if (paginationMode === 'offset') {
      return undefined
    }

    return params[QP_SORT_BY] ? (params[QP_SORT_BY] as string) : undefined
  }, [paginationMode, params])

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
        sort: currentSort as OffsetSortType<any>,
        pagination: {
          perPage,
          page,
        },
      }
    } else {
      preparedVars = {
        ...preparedVars,
        sortBy: currentSortBy as string,
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
    currentSortBy,
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
      return strategy?.list.getTotal?.(result as any, paginationMode) || (paginationMode === 'offset' ? 0 : undefined)
    }

    return undefined
  }, [paginationMode, result, strategy?.list])

  const pageCount = useMemo(() => {
    if (paginationMode === 'offset' || total) {
      const foundedMaxPage = Math.floor((total || 0) / (perPage || defaultPerPage))
      return (total || 0) % (first || last || perPage || defaultPerPage) === 0 ? foundedMaxPage : foundedMaxPage + 1
    }

    return undefined
  }, [defaultPerPage, first, last, paginationMode, perPage, total])

  const list = useMemo<TItem[]>(() => {
    if (!result.loading && result.data) {
      return (strategy?.list.getList(result as any, paginationMode) || []) as TItem[]
    }

    return []
  }, [paginationMode, result, strategy?.list])

  const pageInfo = useMemo(() => {
    if (!result.loading && result.data && paginationMode === 'cursor') {
      return strategy?.list?.getPageInfo?.(result as any) || undefined
    }

    return undefined
  }, [paginationMode, result, strategy?.list])

  const onPageChange = useCallback<OnPageChange>(
    (paginationParams) => {
      if (paginationMode === 'offset') {
        setParams({
          ...params,
          [QP_PAGE]: paginationParams.page,
          [QP_PER_PAGE]: paginationParams.perPage,
        })
      } else {
        const newParams = {
          ...params,
        }

        if ((paginationParams as CursorOnPageChangeParams).first) {
          newParams[QP_FIRST] = (paginationParams as CursorOnPageChangeParams).first as unknown as string
          delete newParams[QP_LAST]
        } else if ((paginationParams as CursorOnPageChangeParams).last) {
          newParams[QP_LAST] = (paginationParams as CursorOnPageChangeParams).last as unknown as string
          delete newParams[QP_FIRST]
        }

        if (paginationParams.after) {
          newParams[QP_AFTER] = paginationParams.after
          delete newParams[QP_BEFORE]
        } else if (paginationParams.before) {
          newParams[QP_BEFORE] = paginationParams.before
          delete newParams[QP_AFTER]
        } else {
          delete newParams[QP_AFTER]
          delete newParams[QP_BEFORE]
        }

        if (paginationParams.revert) {
          newParams[QP_REVERT] = paginationParams.revert
        }

        if (paginationParams.sortBy) {
          newParams[QP_SORT_BY] = paginationParams.sortBy
        }

        if (paginationParams.page) {
          newParams[QP_PAGE] = paginationParams.page
        } else {
          delete newParams[QP_PAGE]
        }

        setParams({
          ...newParams,
        })
      }
    },
    [paginationMode, params, setParams],
  )

  const onSortChange = useCallback<OnSortChange>(
    (sort) => {
      if (paginationMode === 'offset') {
        const newSort = Object.keys(sort).reduce((acc, key) => {
          return {
            ...acc,
            [QP_SORT_PREFIX + key]: sort[key],
          }
        }, {})
        setParams((prevState) => {
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
      } else {
        const newParams = {
          ...params,
        }

        if (sort?.sortBy) {
          newParams[QP_SORT_BY] = sort.sortBy
        } else {
          delete newParams[QP_SORT_BY]
        }

        if (typeof sort.revert === 'boolean') {
          newParams[QP_REVERT] = sort.revert
        } else {
          delete newParams[QP_REVERT]
        }

        if (sort?.last) {
          newParams[QP_LAST] = sort.last
          delete newParams[QP_FIRST]
        } else if (sort?.first) {
          newParams[QP_FIRST] = sort.first
          delete newParams[QP_LAST]
        } else {
          delete newParams[QP_FIRST]
          delete newParams[QP_LAST]
        }

        delete newParams[QP_AFTER]
        delete newParams[QP_BEFORE]

        setParams(newParams)
      }
    },
    [paginationMode, params, setParams],
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

      if (paginationMode === 'offset') {
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

              return { ...filteredPrevState, ...newFilters, [QP_PAGE]: '1' }
            }
            return { ...newFilters, [QP_PAGE]: '1' }
          })(params),
        )
      } else {
        const paramsKeys = Object.keys(params || {})
        const filteredParams = paramsKeys.reduce((acc, item) => {
          if (item.startsWith(QP_FILTERS_PREFIX)) {
            return { ...acc }
          }
          return {
            ...acc,
            [item]: params[item],
          }
        }, {})

        const newParams = {
          ...filteredParams,
        }

        delete newParams[QP_AFTER]
        delete newParams[QP_BEFORE]

        setParams({
          ...newParams,
          ...newFilters,
        })
      }
    },
    [paginationMode, setParams, params],
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
    list,
    total,
    pageCount,
    currentFilters,
    onFiltersChange,
    onPageChange: onPageChange as any,
    onSortChange: onSortChange as any,
  }

  if (paginationMode === 'offset') {
    return {
      ...baseReturn,
      paginationMode: 'offset',
      perPage: perPage || defaultPerPage,
      page: page || 1,
      currentSort: currentSort as OffsetSortType<any>,
    }
  } else {
    console.log('newPage', total && !page ? 1 : page, pageCount)
    return {
      ...baseReturn,
      paginationMode: 'cursor',
      after,
      before,
      first,
      last,
      revert,
      page: total && !page ? 1 : page,
      pageInfo,
      currentSortBy: currentSortBy as string,
    }
  }
}
