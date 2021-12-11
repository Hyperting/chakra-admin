import { Children, useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Container from 'typedi'
import * as H from 'history'
import { AdminCoreProps } from '../../components/admin/AdminCore'
import { AuthProvider } from '../auth/AuthProvider'
import { TOKEN_AUTH_PROVIDER, useSetAuthProvider } from '../auth/useAuthProvider'

type RouteState = {
  background?: H.Location<RouteState>
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
  background?: H.Location<RouteState>
  location: H.Location<RouteState>
} => {
  const setAuthProvider = useSetAuthProvider()
  const [authProviderInstance, setAuthProviderInstance] = useState<AuthProvider>()
  const childrenCount = useMemo<number>(() => Children.count(children), [children])
  const [initialized, setInitialized] = useState<boolean>(false)

  const history = useHistory()
  const location = useLocation<RouteState>()

  const background = useMemo(() => location?.state?.background, [location?.state])

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
    // console.log("controllo se l'utente è loggato prima")
    if (initialized && authProvider && history && authProviderInstance) {
      // console.log("controllo se l'utente è loggato e pare che possa farlo")
      authProviderInstance
        .checkAuth()
        .then(() => {
          console.log('sembro loggato')
          // nothing to do
        })
        .catch(() => {
          setTimeout(() => {
            history.replace('/login')
          }, 400)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, authProviderInstance, history])

  return { childrenCount, initialized, location, background }
}
