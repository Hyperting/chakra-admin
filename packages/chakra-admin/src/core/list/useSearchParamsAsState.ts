import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

export const useSearchParamsAsState = (
  initialState: Record<string, string> = {}
): [Record<string, string>, (newSearchParams: Record<string, string>) => void] => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchParamsState, setSearchParamsState] = useState<Record<string, string>>(initialState)
  const { search } = useLocation()

  useEffect(() => {
    setSearchParamsState(Object.fromEntries(searchParams.entries()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return [searchParamsState, setSearchParams]
}
