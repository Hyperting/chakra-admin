import { atom, useRecoilState, useRecoilValue } from 'recoil'

export const selectedRowsState = atom<string[]>({
  key: 'selectedRowsState',
  default: [],
})

export function useSelectableRows() {
  return useRecoilState(selectedRowsState)
}

export function useSelectableRowsValue() {
  return useRecoilValue(selectedRowsState)
}
