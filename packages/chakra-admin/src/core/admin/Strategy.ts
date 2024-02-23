/* eslint max-classes-per-file: "off" */

import { DocumentNode, gql, OperationVariables, QueryResult, TypedDocumentNode } from '@apollo/client'
import { query } from 'gql-query-builder'
import { generateFields } from '../graphql'
import { PaginationMode, OffsetSortType } from '../list'

export type OffsetPaginationParam = {
  page?: number
  perPage?: number
  disabled?: boolean
}

export type ListGetVariablesParamsBase<TItem extends Record<string, any> = Record<string, any>> = {
  paginationMode: PaginationMode
  resource: string
}

export type ListGetVariablesOffsetParams<TItem extends Record<string, any> = Record<string, any>> =
  ListGetVariablesParamsBase<TItem> & {
    paginationMode: 'offset'
    pagination: OffsetPaginationParam
    sort: OffsetSortType<TItem>
    filters: TItem | Record<string, any>
  }

export type ListGetVariablesCursorParams<TItem extends Record<string, any> = Record<string, any>> =
  ListGetVariablesParamsBase<TItem> & {
    paginationMode: 'cursor'
    after?: string
    before?: string
    first?: number
    last?: number
    revert?: boolean
    sortBy: keyof TItem | string
    filters: TItem | Record<string, any>
    resource: string
  }

export type ListGetVariablesParams<TItem extends Record<string, any> = Record<string, any>> =
  | ListGetVariablesOffsetParams<TItem>
  | ListGetVariablesCursorParams<TItem>

export type GetListResult<TItem = Record<string, any>> = {
  data: TItem[]
  totalCount?: number | undefined | null
}

export type PageInfo = {
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  startCursor?: string | null
  endCursor?: string | null
}

export interface ListStrategy<TData = any, TVariables = OperationVariables, TItem = Record<string, any>> {
  getQuery?(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[],
    paginationMode?: PaginationMode,
  ): DocumentNode | TypedDocumentNode<TData, TVariables>
  // TODO: add support for cursor based pagination
  /* type: 'offset' | 'cursor' */
  getVariables(params: ListGetVariablesParams): TVariables
  getList: (queryResult: QueryResult<TData, TVariables>, paginationMode: PaginationMode) => TItem[]
  getTotal?: (queryResult: QueryResult<TData, TVariables>, paginationMode: PaginationMode) => number | undefined | null
  getPageInfo?: (queryResult: QueryResult<TData, TVariables>) => PageInfo
}

export interface ShowStrategy<
  TData = any,
  TFormValues = Record<string, any>,
  TVariables = OperationVariables,
  TItem = Record<string, any>,
> {
  getId: (item: TItem) => string
  getQuery?(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[],
  ): DocumentNode | TypedDocumentNode<TData, TVariables>
  getItem: (queryResult: QueryResult<TData, TVariables>) => TItem
  getItemVariables: (id: string) => TVariables
  getMutationVariables?: (id: string, values: TFormValues) => TVariables
}

export interface CreateStrategy<TFormValues = Record<string, any>, TVariables = OperationVariables> {
  getMutationVariables: (values: TFormValues) => TVariables
}

export interface EditStrategy<
  TData = any,
  TFormValues = Record<string, any>,
  TVariables = OperationVariables,
  TItem = Record<string, any>,
> {
  getId: (item: TItem) => string
  getItem: (queryResult: QueryResult<TData, TVariables>) => TItem
  getItemVariables: (id: string) => TVariables
  getMutationVariables: (id: string, values: TFormValues) => TVariables
}

export interface DeleteStrategy<TVariables = OperationVariables, TItem = Record<string, any>> {
  getId: (item: TItem) => string
  getVariables: (id: string) => TVariables
}

export interface Strategy {
  list?: Partial<ListStrategy>
  show?: Partial<ShowStrategy>
  create?: Partial<CreateStrategy>
  edit?: Partial<EditStrategy>
  delete?: Partial<DeleteStrategy>
}

export interface GlobalStrategy {
  list: ListStrategy
  show: ShowStrategy
  create: CreateStrategy
  edit: EditStrategy
  delete: DeleteStrategy
}

export class DefaultListStrategy implements ListStrategy {
  getQuery(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[],
  ): DocumentNode | TypedDocumentNode<any, OperationVariables> {
    const result = query({
      operation,
      variables,
      fields: generateFields(fields),
    })

    return gql`
      ${result.query}
    `
  }

  getVariables(params: ListGetVariablesParams): OperationVariables {
    const { paginationMode, resource, ...rest } = params

    return { ...rest }
  }

  getList(queryResult: QueryResult<any, OperationVariables>, paginationMode: PaginationMode): any {
    return queryResult.data.items
  }

  getTotal(queryResult: QueryResult<any, OperationVariables>, paginationMode: PaginationMode): number | undefined {
    return queryResult.data.totalCount
  }

  getPageInfo(queryResult: QueryResult<any, OperationVariables>): PageInfo {
    return queryResult.data.pageInfo
  }
}

export class DefaultShowStrategy implements ShowStrategy {
  getId: ShowStrategy['getId'] = ({ id }) => id

  getQuery(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[],
  ): DocumentNode | TypedDocumentNode<any, OperationVariables> {
    const result = query({
      operation,
      variables,
      fields: generateFields(fields),
    })

    return gql`
      ${result.query}
    `
  }

  getItem: ShowStrategy['getItem'] = (queryResult) => {
    return queryResult.data
  }

  getItemVariables: ShowStrategy['getItemVariables'] = (id) => {
    return { id }
  }

  getMutationVariables: ShowStrategy['getMutationVariables'] = (id, values) => {
    return { id, ...values }
  }
}

export class DefaultCreateStrategy implements CreateStrategy {
  getMutationVariables: CreateStrategy['getMutationVariables'] = (values) => {
    return { ...values }
  }
}

export class DefaultEditStrategy implements EditStrategy {
  getId: EditStrategy['getId'] = ({ id }) => id

  getMutationVariables: EditStrategy['getMutationVariables'] = (id, values) => {
    return { id, ...values }
  }

  getItem: EditStrategy['getItem'] = (queryResult) => {
    return queryResult.data
  }

  getItemVariables: EditStrategy['getItemVariables'] = (id) => {
    return { id }
  }
}

export class DefaultDeleteStrategy implements DeleteStrategy {
  getId: DeleteStrategy['getId'] = ({ id }) => id

  getVariables: DeleteStrategy['getVariables'] = (id) => {
    return { id }
  }
}

export class DefaultStrategy implements GlobalStrategy {
  list = new DefaultListStrategy()

  show = new DefaultShowStrategy()

  create = new DefaultCreateStrategy()

  edit = new DefaultEditStrategy()

  delete = new DefaultDeleteStrategy()
}
