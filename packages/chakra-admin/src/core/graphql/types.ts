import { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client'

export type PaginationMode = 'cursor' | 'offset'

export type GQLOperation<TOperations = Record<string, any>, TData = any, TVariables = OperationVariables> =
  | keyof TOperations
  | (DocumentNode | TypedDocumentNode<TData, TVariables>)

export type OperationType = 'query' | 'mutation'

export type GqlGenerator<TData = any, TVariables = OperationVariables> = (
  resource: string,
  operation: string,
  variables?: OperationVariables,
  fields?: string[],
  paginationMode?: PaginationMode,
) => DocumentNode | TypedDocumentNode<TData, TVariables>
