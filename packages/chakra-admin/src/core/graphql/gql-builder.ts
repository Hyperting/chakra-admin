import React, { useEffect, useMemo, useState } from 'react'
import { DocumentNode, gql, OperationVariables, TypedDocumentNode } from '@apollo/client'
import Fields from 'gql-query-builder/build/Fields'
import { GQLOperation, GqlGenerator, OperationType, PaginationMode } from './types'
import { deepForEach } from 'ca-system'

export const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`

type GetAdditionalFields = () => Fields

const getDefaultAdditionalFields: GetAdditionalFields = () => ['id']

export function generateFields(
  fields?: string[],
  getAdditionalFields: GetAdditionalFields = getDefaultAdditionalFields,
) {
  const newFields: Fields = [...getDefaultAdditionalFields()]
  const deepMappedFields = {}

  for (const field of fields || []) {
    const tree = field.split('.')

    if (tree.length === 1) {
      newFields.push(field)
    } else {
      if (!deepMappedFields[tree[0]]) {
        // deepMappedFields[tree[0]] = tree.length > 2 ? {} : [...getAdditionalFields()]
        deepMappedFields[tree[0]] = [...getAdditionalFields()]
      }

      const newField = deepMappedFields[tree[0]]
      let curr = newField
      for (let i = 1; i < tree.length; i++) {
        const key = tree[i]
        const leftDepth = tree.length - 1 - i

        if (leftDepth > 1) {
          if (Array.isArray(curr)) {
            curr.push({ [key]: {} })
          } else {
            curr[key] = {}
          }
        } else if (leftDepth > 0) {
          if (Array.isArray(curr)) {
            curr.push({ [key]: [...getAdditionalFields()] })
          } else {
            curr[key] = [...getAdditionalFields()]
          }
        } else if (Array.isArray(curr)) {
          curr.push(key)
        }

        if (leftDepth > 0) {
          if (Array.isArray(curr)) {
            curr = curr[curr.length - 1][key]
          } else {
            curr = curr[key]
          }
        }
      }
    }
  }

  newFields.push(
    ...Object.keys(deepMappedFields).map((key) => {
      return { [key]: deepMappedFields[key] }
    }),
  )

  return newFields
}

export type UseGQLBuilderParams<TOperations = Record<string, any>, TData = any, TVariables = OperationVariables> = {
  resource?: string
  type: OperationType
  operation: GQLOperation<TOperations, TData, TVariables>
  variables?: TVariables
  operationName?: string
  generateGql: GqlGenerator<TData, TVariables>
  children?: React.ReactNode
  additionalFields?: string[]
  // parameter set only when type is 'list'
  paginationMode?: PaginationMode
}

export type UseGQLBuilderResult<TData = any, TVariables = OperationVariables> = {
  initialized: boolean
  operation?: DocumentNode | TypedDocumentNode<TData, TVariables>
  type: OperationType
  selectionSet: string[]
}

export function useGqlBuilder<TOperations = Record<string, any>, TData = any, TVariables = OperationVariables>({
  operation,
  resource,
  generateGql,
  variables,
  type,
  children,
  additionalFields,
  paginationMode,
}: UseGQLBuilderParams<TOperations, TData, TVariables>): UseGQLBuilderResult<TData, TVariables> {
  const [initialized, setInitialized] = useState(false)
  const [selectionSet, setSelectionSet] = useState<string[]>([])

  const finalOperation = useMemo<DocumentNode | TypedDocumentNode<TData, TVariables> | undefined>(() => {
    if (typeof operation === 'string' && !generateGql) {
      throw new Error(
        'You must provide a getQuery function in your strategy if you want to generate the query from a string',
      )
    }

    if (typeof operation === 'string' && initialized) {
      return generateGql!(
        resource!,
        operation,
        variables as any,
        Array.from(new Set([...(selectionSet || []), ...(additionalFields || [])])),
        paginationMode,
      )
    }

    if (operation && typeof operation !== 'string') {
      return operation as DocumentNode | TypedDocumentNode<TData, TVariables>
    }

    return EMPTY_QUERY
  }, [additionalFields, generateGql, initialized, operation, resource, selectionSet, variables])

  useEffect(() => {
    if (typeof operation !== 'string') {
      setInitialized(true)
      return
    }

    const newSelectionSet: any[] = []

    deepForEach(children, (child) => {
      if (
        child &&
        (child as any).type &&
        (child as any).props &&
        ((child as any).props.source || (child as any).props.sources)
      ) {
        if ((child as any).props.source && typeof (child as any).props.source === 'string') {
          newSelectionSet.push((child as any).props.source)
        } else if ((child as any).props.sources) {
          const keys = Object.keys((child as any).props.sources)
          for (let i = 0; i < keys.length; i++) {
            if (typeof (child as any).props.sources[keys[i]] === 'string') {
              newSelectionSet.push((child as any).props.sources[keys[i]])
            }
          }
        }
      }
    })

    if (newSelectionSet.length > 0) {
      setSelectionSet(newSelectionSet)
    }
    setInitialized(true)
  }, [children, operation])

  return {
    initialized,
    operation: finalOperation,
    type,
    selectionSet,
  }
}
