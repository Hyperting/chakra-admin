import React, { FC } from 'react'
import { CellProps, HeaderProps, Renderer } from 'react-table'
import { CAFieldProps } from '../../core/react/system'

export type DataTableValueProps<TItem> = {
  isNumeric?: boolean
  render?: Renderer<CellProps<any, any>>
} & CAFieldProps<TItem>

export function DataTableValue<TItem = Record<string, any>>(
  props: DataTableValueProps<TItem>
): React.ReactElement<DataTableValueProps<TItem>> {
  return null as any
}
