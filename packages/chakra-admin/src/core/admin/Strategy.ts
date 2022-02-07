/* eslint max-classes-per-file: "off" */

import {
  DocumentNode,
  gql,
  OperationVariables,
  QueryResult,
  TypedDocumentNode,
} from '@apollo/client'
import { query, mutation, subscription } from 'gql-query-builder'
import { generateFields } from '../graphql'
import { SortType } from '../list'

export type OffsetPaginationParam = {
  first?: number
  after?: number
}

export type ListGetVariablesParams<TItem = Record<string, any>> = {
  pagination: OffsetPaginationParam
  sort: SortType<TItem>
  filters: TItem
}

export type GetListResult<TItem = Record<string, any>> = {
  data: TItem[]
  totalCount: number
}

export interface ListStrategy<
  TData = any,
  TVariables = OperationVariables,
  TItem = Record<string, any>
> {
  getQuery?(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[]
  ): DocumentNode | TypedDocumentNode<TData, TVariables>
  // TODO: add support for cursor based pagination
  /* type: 'offset' | 'cursor' */
  getVariables(params: ListGetVariablesParams): TVariables
  getList: (queryResult: QueryResult<TData, TVariables>) => TItem[]
  getTotal: (queryResult: QueryResult<TData, TVariables>) => number
}

export interface ShowStrategy<
  TData = any,
  TFormValues = Record<string, any>,
  TVariables = OperationVariables,
  TItem = Record<string, any>
> {
  getId: (item: TItem) => string
  getQuery?(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[]
  ): DocumentNode | TypedDocumentNode<TData, TVariables>
  getItem: (queryResult: QueryResult<TData, TVariables>) => TItem
  getItemVariables: (id: string) => TVariables
  getMutationVariables?: (id: string, values: TFormValues) => TVariables
}

export interface CreateStrategy<
  TFormValues = Record<string, any>,
  TVariables = OperationVariables
> {
  getMutationVariables: (values: TFormValues) => TVariables
}

export interface EditStrategy<
  TData = any,
  TFormValues = Record<string, any>,
  TVariables = OperationVariables,
  TItem = Record<string, any>
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
    fields?: string[]
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
    return { ...params }
  }

  getList(queryResult: QueryResult<any, OperationVariables>): any {
    return queryResult.data.items
  }

  getTotal(queryResult: QueryResult<any, OperationVariables>): number {
    return queryResult.data.totalCount
  }
}

export class DefaultShowStrategy implements ShowStrategy {
  getId: ShowStrategy['getId'] = ({ id }) => id

  getQuery(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[]
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
