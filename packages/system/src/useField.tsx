import React, { useMemo } from 'react'
import get from 'lodash.get'
import { CAFieldProps } from './system-field'

export function useField<TItem = Record<string, any>>(props: CAFieldProps<TItem>) {
  const value = useMemo(() => {
    if (typeof props.source === 'string') {
      return get(props.record || {}, props.source, undefined)
    } else if (typeof props.source === 'function') {
      return props.source(props.record || {})
    }

    return undefined
  }, [props])

  return value
}
