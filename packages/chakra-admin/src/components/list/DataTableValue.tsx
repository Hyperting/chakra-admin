import React, { FC } from 'react'
import { CellProps, HeaderProps, Renderer } from 'react-table'

export type DataTableValueProps<TItem> = {
  source: keyof TItem
  sortable?: boolean
  isNumeric?: boolean
  render?: Renderer<CellProps<any, any>>
  label?: Renderer<HeaderProps<any>> | string
}

export function DataTableValue<TItem = Record<string, any>>(
  props: DataTableValueProps<TItem>
): React.ReactElement<DataTableValueProps<TItem>> {
  return null as any
}
