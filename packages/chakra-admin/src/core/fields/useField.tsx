import get from 'lodash.get'
import { useMemo } from 'react'
import { CAFieldProps } from '../react/system-field'

export function useField<TItem = Record<string, any>>(props: CAFieldProps<TItem>) {
  const value = () => {
    if (typeof props.source === 'string') {
      return get(props.record || {}, props.source, undefined)
    } else if (typeof props.source === 'function') {
      return props.source(props.record || {})
    }

    return undefined
  }

  return value
}
