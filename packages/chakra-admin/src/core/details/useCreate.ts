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
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreateProps } from '../../components/details/Create'
import { useGlobalStrategy } from '../admin/useGlobalStrategy'
import { useVersion } from '../admin/versionState'
import { navigateBehavior } from './navigateBehavior'

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
  defaultValues: any
}

export const useCreate = <
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>({
  mutation,
  resource,
  redirect = true,
  onSuccess,
}: CreateProps): UseCreateResult<TData, TVariables, TContext, TCache> => {
  const [executeMutation, mutationResult] = useMutation<TData, TVariables, TContext, TCache>(mutation)
  const navigate = useNavigate()
  const toast = useToast()
  const strategy = useGlobalStrategy()
  const nextVersion = useVersion()
  const location = useLocation()

  const defaultValues = useMemo(
    () => (location?.state as { defaultValues?: Location })?.defaultValues || {},
    [location?.state]
  )

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        console.log('Error During Creation submit111', toast)
        toast({
          status: 'error',
          title: `Errore durante la creazione della risorsa ${resource}`,
          description: 'Error During Creation submit',
          isClosable: true,
          duration: 5000,
        })

        console.log('Error During Creation submit222', toast)
        const variables = strategy?.create.getMutationVariables(values)
        if (!variables) {
          throw new Error('No variables found in CreateStrategy')
        }

        const result = await executeMutation({
          variables: variables as TVariables,
          // optimisticResponse: values,
        })

        if (result.data && !result.errors) {
          if (onSuccess) {
            await onSuccess(result.data as any)
          }

          toast({
            status: 'success',
            title: `${resource} created.`,
            isClosable: true,
          })

          nextVersion()

          navigateBehavior(navigate, redirect, result.data)
        }

        return result
      } catch (error: any) {
        console.log('Error During Creation submit222', error, toast)
        toast({
          status: 'error',
          title: `Errore durante la creazione della risorsa ${resource}`,
          description: error?.message || 'Error During Creation submit',
          isClosable: true,
          duration: 5000,
        })
        // console.error('Error During Creation submit', error)
      }
    },
    [executeMutation, navigate, nextVersion, toast, onSuccess, redirect, resource, strategy?.create]
  )

  return {
    executeMutation,
    mutationResult,
    onSubmit,
    defaultValues,
  }
}
