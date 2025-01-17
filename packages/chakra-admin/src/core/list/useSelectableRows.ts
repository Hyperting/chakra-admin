import { atom, atomFamily, useRecoilState, useRecoilValue } from 'recoil'

export const selectedRowsState = atomFamily<string[], string>({
  key: 'selectedRowsState',
  default: [],
})

export function useSelectableRows(resource: string) {
  return useRecoilState(selectedRowsState(resource))
}

export function useSelectableRowsValue(resource: string) {
  return useRecoilValue(selectedRowsState(resource))
}
