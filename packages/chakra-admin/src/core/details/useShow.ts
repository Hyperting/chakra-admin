import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  gql,
  MutationFunctionOptions,
  MutationResult,
  OperationVariables,
  QueryResult,
  useMutation,
  useQuery,
} from '@apollo/client'
import { useToast } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import { useGqlBuilder } from '../graphql/gql-builder'
import { ShowProps } from '../../components/details/Show'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'

const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`

export type UseShowResult<
  TData = any,
  TVariables = OperationVariables,
  TItem = Record<string, any>,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
> = {
  executeMutation: (
    options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>
  ) => Promise<FetchResult<TData>>
  mutationResult?: MutationResult<TData>
  onSubmit: (values: any) => Promise<MutationResult<TData>>
  item?: TItem
} & QueryResult<TData, TVariables>

export const useShow = <
  ItemTData = any,
  ItemTVariables = OperationVariables,
  ShowTData = any,
  ShowTVariables = OperationVariables
>({
  mutation,
  resource,
  query,
  id,
  fields,
  children,
}: ShowProps<ItemTData, ItemTVariables, ShowTData, ShowTVariables>): UseShowResult => {
  const strategy = useGlobalStrategy()
  const queryVariables = useMemo(() => (id ? strategy?.show.getItemVariables(id) : undefined), [
    id,
    strategy?.show,
  ])

  const { operation, initialized } = useGqlBuilder({
    type: 'query',
    resource,
    children,
    operation: query,
    variables: queryVariables,
    generateGql: strategy?.show?.getQuery || (() => EMPTY_QUERY),
    additionalFields: fields,
  })

  const [executeMutation, mutationResult] = useMutation<ShowTData, ShowTVariables>(mutation as any)
  const data = useQuery<ItemTData, ItemTVariables>(operation as any, {
    variables: queryVariables as ItemTVariables,
    skip: !id || !initialized || !operation || !queryVariables,
  })
  const item = useMemo(() => (data.data ? strategy?.show.getItem(data) : undefined), [
    data,
    strategy?.show,
  ])

  const notify = useToast()

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        if (!id) {
          throw new Error('No id found')
        }
        if (!strategy?.show.getMutationVariables) {
          throw new Error('No implementation found for ShowStrategy.getMutationVariables')
        }

        const variables = strategy.show.getMutationVariables(id, values)
        if (!variables) {
          throw new Error('No variables found in ShowStrategy.getMutationVariables()')
        }

        const result = await executeMutation({ variables: variables as ShowTVariables })
        if (result.data && !result.errors) {
          notify({
            status: 'success',
            title: `${resource} updated.`,
            isClosable: true,
          })
          data.refetch()
        } else {
          throw new Error('Error updating data')
        }
        return result
      } catch (error: any) {
        console.error('Error During Show submit', error)
        notify({
          status: 'error',
          title: `Errore durante la modifica della risorsa ${resource}`,
          description: error && error.message ? error.message : undefined,
        })
      }
    },
    [id, strategy?.show, executeMutation, notify, resource, data]
  )

  return {
    item,
    executeMutation: executeMutation as any,
    mutationResult,
    onSubmit,
    ...data,
  }
}
