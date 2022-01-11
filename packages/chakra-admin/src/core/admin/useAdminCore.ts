import { Children, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Container from 'typedi'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history'
import { AdminCoreProps } from '../../components/admin/AdminCore'
import { AuthProvider } from '../auth/AuthProvider'
import { TOKEN_AUTH_PROVIDER, useSetAuthProvider } from '../auth/useAuthProvider'

type RouteState = {
  background?: Location
}

/**
 * This hook initialize the Admin App.
 * IMPORTANT! Don't use this hook more than once
 *
 * @param {React.ReactNode} children - children must be one or more Resources
 * @param {AuthProvider} authProvider - The AuthProvider used to manage user authentication
 */
export const useAdminCore = ({
  children,
  authProvider,
}: AdminCoreProps): {
  childrenCount: number
  initialized: boolean
  background?: Location
  location: Location
} => {
  const setAuthProvider = useSetAuthProvider()
  const [authProviderInstance, setAuthProviderInstance] = useState<AuthProvider>()
  const childrenCount = useMemo<number>(() => Children.count(children), [children])
  const [initialized, setInitialized] = useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()

  const background = useMemo(() => (location?.state as { background?: Location })?.background, [
    location?.state,
  ])

  useEffect(() => {
    const initAuthProvider = (): void => {
      if (authProvider) {
        setAuthProvider(authProvider)
        const instance = Container.get<AuthProvider>(TOKEN_AUTH_PROVIDER)
        setAuthProviderInstance(instance)
        instance?.init()
      }
    }

    if (!initialized) {
      initAuthProvider()
      setInitialized(true)
    }
    // eslint-disable-next-line
    return (): void => {
      // if (Container.has('contentListener')) {
      //   Container.remove('contentListener')
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initialized && authProvider && navigate && authProviderInstance) {
      authProviderInstance
        .checkAuth()
        .then(() => {
          // nothing to do
        })
        .catch(() => {
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 400)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, authProviderInstance, navigate])

  return { childrenCount, initialized, location, background }
}
