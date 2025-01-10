import { Checkbox, CheckboxProps } from '@chakra-ui/react'
import { useSelectableRows } from '../../core'

export type SelectableHeaderProps = {
  list?: any[]
} & CheckboxProps

export function SelectableHeader({ list = [], ...props }: SelectableHeaderProps) {
  const [selectedRows, setSelectedRows] = useSelectableRows()

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
