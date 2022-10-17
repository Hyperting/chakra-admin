import { useRef } from 'react'

let uniqueId = 0
// eslint-disable-next-line no-plusplus
const getUniqueId = () => uniqueId++

export function useComponentId() {
  const idRef = useRef(`${getUniqueId()}`)
  return idRef.current
}
