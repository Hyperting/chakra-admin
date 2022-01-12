import { OperationVariables, QueryResult } from "@apollo/client"
import { DefaultListStrategy, DefaultStrategy, ListGetVariablesParams } from "chakra-admin"

export class ListStrategy extends DefaultListStrategy {
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

export class ExampleStrategy extends DefaultStrategy {
  list = new ListStrategy()
}