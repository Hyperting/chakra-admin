import { useCallback } from 'react'
import { Container } from 'typedi'
import { ClassType } from '../ClassType'
import { AuthProvider } from './AuthProvider'

export const TOKEN_AUTH_PROVIDER = 'donalaspesa_AuthProvider'

type SetAuthProviderFunction = (newValue: ClassType<AuthProvider> | undefined) => void

export const useAuthProvider = (): AuthProvider | undefined => {
  if (Container.has(TOKEN_AUTH_PROVIDER)) {
    return Container.get<AuthProvider>(TOKEN_AUTH_PROVIDER)
  }
}

export const useSetAuthProvider = (): SetAuthProviderFunction => {
  return useCallback((newValue: ClassType<AuthProvider> | undefined) => {
    Container.set({ id: TOKEN_AUTH_PROVIDER, type: newValue })
  }, [])
}
