import { useContext } from 'react'
import { useSearchParams, UNSAFE_NavigationContext, URLSearchParamsInit } from 'react-router-dom'
import { QueryParamConfig, StringParam } from 'serialize-query-params'
import { isString } from 'lodash'

export const useSearchParamsAsState = (
  initialState: Record<string, string> = {}
): [
  Record<string, string>,
  (nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit)) => void
] => {
  const [searchParams, setSearchParams] = useSearchParams()

  //   const [searchParamsState, setSearchParamsState] = useState<Record<string, string>>(initialState)
  //   const { search } = useLocation()

  //   useEffect(() => {
  //     setSearchParamsState({
  //       ...Object.fromEntries(new URLSearchParams(searchParams.toString()).entries()),
  //       // ...Object.fromEntries(searchParams.entries()),
  //     })
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [search])

  const searchParamsAsObj = {
    ...Object.fromEntries(new URLSearchParams(searchParams.toString()).entries()),
    // ...Object.fromEntries(searchParams.entries()),
  }

  const setSearchParamsChanged = (newS: any): void => {
    console.log(newS, 'new')
    setSearchParams(newS)
  }

  return [searchParamsAsObj, setSearchParamsChanged]
}

export type NewValueType<D> = D | ((latestValue: D) => D)
export type UrlUpdateType = 'replace' | 'push' | undefined
export type UseSearchParam<D, D2 = D> = [D2, (newValue: NewValueType<D>, updateType?: UrlUpdateType) => void]

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
      params.set(name, encodedValue as any)
    } else {
      params.delete(name)
    }
    setSearchParams(params, { replace: updateType === 'replace' })
  }

  const decodedValue = config.decode(searchParams.get(name))
  return [decodedValue, setNewValue]
}
