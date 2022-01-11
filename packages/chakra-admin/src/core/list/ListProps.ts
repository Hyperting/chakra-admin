import React from 'react'
import { DocumentNode } from 'graphql'
import { TypedDocumentNode } from 'urql'
import { SortType } from './SortType'

export type ListProps<Data = object, Variables = any> = {
  resource?: string
  basePath?: string
  defaultSorting?: SortType<any>
  additionalTypenames?: string[] | undefined
  titleComponent?: React.ReactNode
  filtersComponent?: React.ReactNode
  toolbarComponent?: React.ReactNode
  listComponent?: React.ReactNode
  query: string | DocumentNode | TypedDocumentNode<Data, Variables>
  deleteItemMutation?: string | DocumentNode | TypedDocumentNode<Data, Variables>
  showMoreMenu?: boolean
  showMoreMenuEdit?: boolean
  showMoreMenuDelete?: boolean
  hasDelete?: boolean
  hasEdit?: boolean
  hasCreate?: boolean
  hasShow?: boolean
  hasList?: boolean
}
