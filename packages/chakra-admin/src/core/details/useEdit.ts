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
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStrategy } from '..'
import { EditProps } from '../../components/details/Edit'
import { useVersion } from '../admin/versionState'
import { navigateBehavior } from './navigateBehavior'

export type UseEditResult<
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

export const useEdit = <
  ItemTData = any,
  ItemTVariables = OperationVariables,
  EditTData = any,
  EditTVariables = OperationVariables
>({
  mutation,
  resource,
  query,
  id,
  redirect = true,
  onSuccess,
}: EditProps<ItemTData, ItemTVariables, EditTData, EditTVariables>): UseEditResult => {
  const strategy = useGlobalStrategy()
  const queryVariables = useMemo(() => (id ? strategy?.edit.getItemVariables(id) : undefined), [id, strategy?.edit])

  const [executeMutation, mutationResult] = useMutation<EditTData, EditTVariables>(mutation)
  const data = useQuery<ItemTData, ItemTVariables>(query, {
    variables: queryVariables as ItemTVariables,
    fetchPolicy: 'no-cache',
    skip: !id,
  })

  const item = useMemo(() => (data.data ? strategy?.edit.getItem(data as any) : undefined), [data, strategy?.edit])

  const navigate = useNavigate()
  const notify = useToast()
  const nextVersion = useVersion()

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        if (!id) {
          throw new Error('No id found')
        }

        const variables = strategy?.edit.getMutationVariables(id, values)
        if (!variables) {
          throw new Error('No variables found in EditStrategy.getMutationVariables()')
        }

        const result = await executeMutation({ variables: variables as EditTVariables })
        if (result.data && !result.errors) {
          if (onSuccess) {
            await onSuccess(result.data as any)
          }

          notify({
            status: 'success',
            title: `${resource} updated.`,
            isClosable: true,
          })

          nextVersion()
          navigateBehavior(navigate, redirect, result.data)
          // let goTo: boolean | string

          // switch (typeof redirect) {
          //   case 'function':
          //     goTo = redirect(result.data) ?? true
          //     break
          //   case 'undefined':
          //     goTo = true
          //     break
          //   default:
          //     goTo = redirect
          // }

          // if (goTo) {
          //   if (typeof goTo === 'string') {
          //     navigate(goTo)
          //   } else {
          //     navigate(-1)
          //   }
          // }
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
    [id, strategy?.edit, executeMutation, notify, resource, redirect, nextVersion, navigate]
  )

  return {
    item,
    executeMutation: executeMutation as any,
    mutationResult,
    onSubmit,
    ...data,
  } as any
}
