import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  MutationResult,
  OperationVariables,
  useMutation,
} from '@apollo/client'
import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateProps } from '../../components/details/Create'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'

export type UseCreateResult<
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
> = {
  executeMutation: (
    options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>
  ) => Promise<FetchResult<TData>>
  mutationResult?: MutationResult<TData>
  onSubmit: (values: any) => Promise<MutationResult<TData>>
}

export const useCreate = <
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>({
  mutation,
  resource,
}: CreateProps): UseCreateResult<TData, TVariables, TContext, TCache> => {
  const [executeMutation, mutationResult] = useMutation<TData, TVariables, TContext, TCache>(
    mutation
  )
  const navigate = useNavigate()
  const notify = useToast()
  const strategy = useGlobalStrategy()

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        const variables = strategy?.create.getVariables(values)
        if (!variables) {
          throw new Error('No variables found in CreateStrategy')
        }

        const result = await executeMutation({
          variables: variables as TVariables,
        })
        if (result.data && !result.errors) {
          notify({
            status: 'success',
            title: `${resource} created.`,
            isClosable: true,
          })
          navigate(-1)
        } else {
          throw new Error('Error creating data')
        }
        return result
      } catch (error: any) {
        console.error('Error During Creation submit', error)
        notify({
          status: 'error',
          title: `Errore durante la creazione della risorsa ${resource}`,
          description: error && error.message ? error.message : undefined,
          isClosable: true,
        })
      }
    },
    [executeMutation, navigate, notify, resource, strategy?.create]
  )

  return {
    executeMutation,
    mutationResult,
    onSubmit,
  }
}
