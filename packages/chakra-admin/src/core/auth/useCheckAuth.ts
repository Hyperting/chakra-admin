import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthProvider } from './useAuthProvider'

export type UseCheckAuthProps = {
  onAuthCheck?: (isAuthenticated: boolean) => void
}

export type UseCheckAuthReturn = {
  initialized: boolean
  isAuthenticated: boolean
}

export const useCheckAuth = (props?: UseCheckAuthProps) => {
  const authProvider = useAuthProvider()
  const [initialized, setInitialized] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        await authProvider?.checkAuth()
        setIsAuthenticated(true)
        if (props?.onAuthCheck) {
          props.onAuthCheck(true)
        }
      } catch (error) {
        setIsAuthenticated(false)
        if (props?.onAuthCheck) {
          props.onAuthCheck(false)
        }
      } finally {
        setInitialized(true)
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return {
    initialized,
    isAuthenticated,
  }
}
