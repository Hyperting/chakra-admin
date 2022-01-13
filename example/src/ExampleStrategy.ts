import { OperationVariables, QueryResult } from "@apollo/client"
import { CreateStrategy, ListStrategy, DefaultStrategy, ListGetVariablesParams, DefaultEditStrategy } from "chakra-admin"

export class ExampleListStrategy implements ListStrategy {
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
    return {
      data: { ...values }
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
    return {
      id,
      data: { ...values }
    }
  }
}

export class ExampleStrategy extends DefaultStrategy {
  list = new ExampleListStrategy()
  create = new ExampleCreateStrategy()
  edit = new ExampleEditStrategy()
  show = new ExampleEditStrategy()
}
