import React from 'react'
import { CellProps, Renderer } from 'react-table'
import { CAFieldProps } from 'ca-system'

export type DataTableValueProps<TItem> = {
  isNumeric?: boolean
  render?: Renderer<CellProps<any, any>>
} & CAFieldProps<TItem>

export function DataTableValue<TItem = Record<string, any>>(
  props: DataTableValueProps<TItem>
): React.ReactElement<DataTableValueProps<TItem>> {
  return null as any
}
