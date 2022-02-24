import { useEffect, useState, useContext } from 'react'
import { useLocation, useSearchParams, UNSAFE_NavigationContext } from 'react-router-dom'
import { QueryParamConfig, StringParam } from 'serialize-query-params'
import { isString } from 'lodash'

export const useSearchParamsAsState = (
  initialState: Record<string, string> = {}
): [Record<string, string>, (newSearchParams: Record<string, string>) => void] => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchParamsState, setSearchParamsState] = useState<Record<string, string>>(initialState)
  const { search } = useLocation()
  console.log(searchParams, search, 'vediamo che succede')

  useEffect(() => {
    console.log('setto cose', {
      ...Object.fromEntries(new URLSearchParams(search).entries()),
      ...Object.fromEntries(searchParams.entries()),
    })

    setSearchParamsState({
      ...Object.fromEntries(new URLSearchParams(search).entries()),
      ...Object.fromEntries(searchParams.entries()),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return [searchParamsState, setSearchParams]
}

export type NewValueType<D> = D | ((latestValue: D) => D)
export type UrlUpdateType = 'replace' | 'push' | undefined
export type UseSearchParam<D, D2 = D> = [
  D2,
  (newValue: NewValueType<D>, updateType?: UrlUpdateType) => void
]

export function useSearchParam<D, D2 = D>(
  name: string,
  config: QueryParamConfig<D, D2> = StringParam as QueryParamConfig<any>
): UseSearchParam<D, D2> {
  const [searchParams, setSearchParams] = useSearchParams()
  const { navigator } = useContext(UNSAFE_NavigationContext)

  const setNewValue = (valueOrFn: NewValueType<D>, updateType?: UrlUpdateType): void => {
    let newValue
    const value = searchParams.get(name)
    if (typeof valueOrFn === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-types
      newValue = (valueOrFn as Function)(config.decode(value))
    } else {
      newValue = valueOrFn
    }
    const encodedValue = config.encode(newValue)

    const params = new URLSearchParams((navigator as any).location.search)

    if (isString(encodedValue)) {
      params.set(name, encodedValue)
    } else {
      params.delete(name)
    }
    setSearchParams(params, { replace: updateType === 'replace' })
  }

  const decodedValue = config.decode(searchParams.get(name))
  return [decodedValue, setNewValue]
}
