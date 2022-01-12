import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  MutationResult,
  OperationVariables,
  QueryResult,
  useMutation,
  useQuery,
} from '@apollo/client'
import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditProps } from '../../components/details/Edit'

export type UseEditResult<
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
} & QueryResult<TData, TVariables>

export const useEdit = <
  ItemTData = any,
  ItemTVariables = OperationVariables,
  EditTData = any,
  EditTVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>({
  mutation,
  resource,
  query,
  id,
}: EditProps): UseEditResult => {
  const [executeMutation, mutationResult] = useMutation(mutation)
  const data = useQuery(query, {
    variables: {
      id,
    },
    skip: !id,
  })

  const navigate = useNavigate()
  const notify = useToast()

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        const result = await executeMutation({ variables: { id, data: values } })
        if (result.data && !result.errors) {
          notify({
            status: 'success',
            title: `${resource} updated.`,
            isClosable: true,
          })
          navigate(-1)
        } else {
          throw new Error('Error updating data')
        }
        return result
      } catch (error: any) {
        console.error('Error During Edit submit', error)
        notify({
          status: 'error',
          title: `Errore durante la modifica della risorsa ${resource}`,
          description: error && error.message ? error.message : undefined,
        })
      }
    },
    [executeMutation, navigate, id, notify, resource]
  )

  return {
    executeMutation,
    mutationResult,
    onSubmit,
    ...data,
  }
}
