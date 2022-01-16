import get from 'lodash.get'
import { useMemo } from 'react'
import { CAFieldProps } from '../react/system'

export function useField<TItem = Record<string, any>>(props: CAFieldProps<TItem>) {
  const value = useMemo(() => {
    const value = get(props.record || {}, props.source, undefined)
    return value
  }, [props.record, props.source])

  return value
}
