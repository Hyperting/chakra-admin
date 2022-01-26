import React, { ReactElement } from 'react'
import { DocumentNode } from 'graphql'
import {
  MutationHookOptions,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
} from '@apollo/client'
import { SortType } from './SortType'
import { ListStrategy } from '../admin/Strategy'
import { PageLayoutProps } from '../../components/details/PageLayout'

export type ListProps<
  ListTData = any,
  ListTVariables = OperationVariables,
  DeleteTData = any,
  DeleteTVariables = OperationVariables
> = {
  resource?: string
  basePath?: string
  defaultSorting?: SortType<any>
  defaultFilters?: Record<string, any>
  filtersComponent?: React.ReactNode
  toolbarComponent?: React.ReactNode
  query: DocumentNode | TypedDocumentNode<ListTData, ListTVariables>
  queryOptions?: QueryHookOptions<ListTData, ListTVariables>
  listStrategy?: Partial<ListStrategy>
  deleteItemMutation?: DocumentNode | TypedDocumentNode<DeleteTData, DeleteTVariables>
  deleteItemMutationOptions?: MutationHookOptions<DeleteTData, DeleteTVariables>
  showMoreMenu?: boolean
  showMoreMenuEdit?: boolean
  showMoreMenuDelete?: boolean
  hasDelete?: boolean
  hasEdit?: boolean
  hasCreate?: boolean
  hasShow?: boolean
  hasList?: boolean
  layout?: ReactElement<PageLayoutProps, any>
} & Pick<PageLayoutProps, 'title'>
