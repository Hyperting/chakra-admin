import { OperationVariables } from '@apollo/client'
import React, { FC } from 'react'
import { useGqlBuilder, UseGQLBuilderParams } from '../../core/graphql/gql-builder'

type GqlBuilderProps<
  TOperations = Record<string, any>,
  TData = any,
  TVariables = OperationVariables
> = UseGQLBuilderParams<TOperations, TData, TVariables>

export const GqlBuilder: FC<GqlBuilderProps> = ({ children, ...props }) => {
  const { operation, initialized, type } = useGqlBuilder(props)

  return <>{children}</>
}
