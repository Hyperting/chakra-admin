import { Checkbox, CheckboxProps } from '@chakra-ui/react'
import { useSelectableRows } from '../../core'

export type SelectableHeaderProps = {
  list?: any[]
  resource?: string
} & CheckboxProps

export function SelectableHeader({ list = [], resource, ...props }: SelectableHeaderProps) {
  const [selectedRows, setSelectedRows] = useSelectableRows(resource as string)

  const isSelectedAll = list?.length > 0 && selectedRows.length === list?.length
  const isIndeterminate = list?.length > 0 && selectedRows.length > 0 && selectedRows.length < list?.length

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSelectedAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(list.map((item) => item.id))
    }
  }

  return <Checkbox {...props} onChange={onChange} isChecked={!!isSelectedAll} isIndeterminate={isIndeterminate} />
}
