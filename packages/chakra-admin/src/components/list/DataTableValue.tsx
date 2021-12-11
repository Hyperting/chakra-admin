import React, { FC } from 'react'
import { CellProps, HeaderProps, Renderer } from 'react-table'

export type DataTableValueProps = {
  source: string
  sortable?: boolean
  isNumeric?: boolean
  render?: Renderer<CellProps<any, any>>
  label?: Renderer<HeaderProps<any>> | string
}

export const DataTableValue: FC<DataTableValueProps> = () => null
