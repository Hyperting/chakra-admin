import { Checkbox, CheckboxProps } from '@chakra-ui/react'
import { memo } from 'react'
import { useSelectableRows } from '../../core'

export type SelectColumnCheckboxProps = {
  rowId?: string
} & CheckboxProps

export const SelectColumnCheckbox = memo(({ rowId, ...props }: SelectColumnCheckboxProps) => {
  const [selectedRows, setSelectedRows] = useSelectableRows()

  const isSelected = rowId && selectedRows.includes(rowId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!rowId) {
      return
    }

    setSelectedRows((prevSelectedRows) => {
      if (isSelected) {
        return prevSelectedRows.filter((id) => id !== rowId)
      }
      return [...prevSelectedRows, rowId]
    })
  }

  return <Checkbox {...props} isChecked={!!isSelected} onChange={handleChange} />
})
