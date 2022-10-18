import { DocumentNode, gql, OperationVariables, QueryResult, TypedDocumentNode } from "@apollo/client"
import { CreateStrategy, ListStrategy, DefaultStrategy, ListGetVariablesParams, DefaultEditStrategy, generateFields } from "chakra-admin"
import { query } from 'gql-query-builder'

export class ExampleListStrategy implements ListStrategy {
  getQuery(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[]
  ): DocumentNode | TypedDocumentNode<any, OperationVariables> {
    const result = query({
      operation,
      variables: {
        pagination: {
          type: 'PaginationInputType',
        },
        filters: { type: `${resource}FilterInput` },
        sort: { type: `${resource}SortInput` },
      },
      fields: ['total', 'offset', 'error', { data: generateFields(fields) }],
    })

    return gql`
      ${result.query}
    `
  }

  getList({ data }: QueryResult<any, OperationVariables>): Record<string, any>[] {
    return data && Object.keys(data).length > 0 && (data as any)[Object.keys(data)[0]]
    ? (data as any)[Object.keys(data)[0]].data
    : []
  }

  getTotal(result: QueryResult<any, OperationVariables>) {
    const dataKeys = Object.keys(result.data)
    if (
      dataKeys.length > 0 &&
      (result.data as any)[dataKeys[0]] &&
      (result.data as any)[dataKeys[0]].total
    ) {
      return (result.data as any)[dataKeys[0]].total as number
    }

    return 0
  }

  getVariables(params: ListGetVariablesParams<Record<string, any>>) {
    return {
      ...params,
      pagination: {
        limit: params.pagination.first,
        offset: params.pagination.after,
      }
    }
  }
}

export class ExampleCreateStrategy implements CreateStrategy {
  
  getMutationVariables(values: Record<string, any>): OperationVariables {
    const { __typename, ...rest } = values
    return {
      data: { ...rest }
    }
  }
}

export class ExampleEditStrategy extends DefaultEditStrategy {
  getItem = ({ data }: QueryResult<any, OperationVariables>): Record<string, any> => {
    return data && Object.keys(data).length > 0
    ? (data as any)[Object.keys(data)[0]]
    : undefined
  }

  getItemVariables = (id: string): OperationVariables => {
    return { id }
  }

  getMutationVariables = (id: string, values: Record<string, any>): OperationVariables => {
    const { id: rId, __typename, ...rest } = values
    return {
      id,
      data: { ...rest }
    }
  }
  
  getQuery(
    resource: string,
    operation: string,
    variables?: OperationVariables,
    fields?: string[]
  ): DocumentNode | TypedDocumentNode<any, OperationVariables> {
    const result = query({
      operation,
      variables: {
        pagination: {
          type: 'PaginationInputType',
        },
        filters: { type: `${resource}FilterInput` },
        sort: { type: `${resource}SortInput` },
      },
      fields: ['total', 'offset', 'error', { data: generateFields(fields) }],
    })

    return gql`
      ${result.query}
    `
  }
}

export class ExampleStrategy extends DefaultStrategy {
  list = new ExampleListStrategy()
  create = new ExampleCreateStrategy()
  edit = new ExampleEditStrategy()
  show = new ExampleEditStrategy()
}
