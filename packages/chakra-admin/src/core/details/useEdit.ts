import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useHistory } from 'react-router'
import {
  OperationContext,
  OperationResult,
  useMutation,
  UseMutationState,
  useQuery,
  UseQueryState,
} from 'urql'
import { EditProps } from '../../components/details/Edit'

export type UseEditResult = {
  executeMutation: (
    variables?: any,
    context?: Partial<OperationContext> | undefined
  ) => Promise<OperationResult<object, any>>
  mutationResult?: UseMutationState<object, any>
  onSubmit: (values: any) => Promise<UseMutationState<object, any>>
} & UseQueryState<object, any>

export const useEdit = ({ mutation, resource, query, id }: EditProps): UseEditResult => {
  const [mutationResult, executeMutation] = useMutation(mutation)
  const [data, refetchDefaultValues] = useQuery({
    query,
    variables: {
      id,
    },
    pause: !id,
  })

  const history = useHistory()
  const notify = useToast()

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        const result = await executeMutation({ id, data: values })
        if (result.data && !result.error) {
          notify({
            status: 'success',
            title: `${resource} updated.`,
            isClosable: true,
          })
          history.goBack()
        } else {
          throw new Error(result.error?.message)
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
    [executeMutation, history, id, notify, resource]
  )

  return {
    executeMutation,
    mutationResult,
    onSubmit,
    ...data,
  }
}
