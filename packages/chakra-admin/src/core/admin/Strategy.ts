/* eslint max-classes-per-file: "off" */

import { OperationVariables, QueryResult } from '@apollo/client'
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
  // TODO: add support for cursor based pagination
  /* type: 'offset' | 'cursor' */
  getVariables(params: ListGetVariablesParams): TVariables
  getList: (queryResult: QueryResult<TData, TVariables>) => TItem[]
  getTotal: (queryResult: QueryResult<TData, TVariables>) => number
}

export interface ShowStrategy<
  TData = any,
  TVariables = OperationVariables,
  TItem = Record<string, any>
> {
  getVariables: (id: string | number) => TVariables
  getItem: (queryResult: QueryResult<TData, TVariables>) => TItem
}

export interface CreateStrategy<
  TFormValues = Record<string, any>,
  TVariables = OperationVariables
> {
  getVariables: (values: TFormValues) => TVariables
}

export interface EditStrategy<TFormValues = Record<string, any>, TVariables = OperationVariables> {
  getVariables: (data: TFormValues) => TVariables
}

export interface DeleteStrategy<TVariables = OperationVariables> {
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
  getItem: ShowStrategy['getItem'] = (queryResult) => {
    return queryResult.data
  }

  getVariables: ShowStrategy['getVariables'] = (id) => {
    return { id }
  }
}

export class DefaultFormStrategy implements CreateStrategy, EditStrategy {
  getVariables: CreateStrategy['getVariables'] = (values) => {
    return { ...values }
  }
}

export class DefaultDeleteStrategy implements DeleteStrategy {
  getVariables: DeleteStrategy['getVariables'] = (id) => {
    return { id }
  }
}

export class DefaultStrategy implements GlobalStrategy {
  list = new DefaultListStrategy()

  show = new DefaultShowStrategy()

  create = new DefaultFormStrategy()

  edit = new DefaultFormStrategy()

  delete = new DefaultDeleteStrategy()
}
