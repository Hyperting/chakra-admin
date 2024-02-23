import { useCallback } from 'react'
import { atom, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

export const VERSION_STATE_KEY = 'versionState'

export const versionState = atom<number>({
  key: VERSION_STATE_KEY,
  default: 0,
})

export const useVersionState = () => useRecoilState(versionState)
export const useVersionStateValue = () => useRecoilValue(versionState)
export const useSetVersionState = () => useSetRecoilState(versionState)
export const useResetVersionState = () => useResetRecoilState(versionState)

export const useVersion = () => {
  const [version, setVersion] = useRecoilState(versionState)

  const next = useCallback(() => {
    setVersion(version + 1)
  }, [setVersion, version])

  return next
}
