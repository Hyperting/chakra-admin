import React, { Children, isValidElement, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Container from 'typedi'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history'
import { AdminCoreProps } from '../../components/admin/AdminCore'
import { AuthProvider } from '../auth/AuthProvider'
import { DefaultStrategy } from './Strategy'
import { TOKEN_AUTH_PROVIDER, useSetAuthProvider } from '../auth/useAuthProvider'
import { useSetGlobalStrategy } from './useGlobalStrategy'
import { registeredIcons, RegisteredResources, useSetAdminState } from './adminState'
import { Resource } from '../../components/admin'

type RouteState = {
  background?: Location
}

/**
 * This hook initialize the Admin App.
 * IMPORTANT! Don't use this hook more than once
 *
 * @param {React.ReactNode} children - children must be one or more Resources
 * @param {GlobalStrategy} strategy - The AuthProvider used to manage user authentication
 * @param {AuthProvider} authProvider - The AuthProvider used to manage user authentication
 */
export const useAdminCore = ({
  children,
  authProvider,
  strategy = DefaultStrategy,
}: AdminCoreProps): {
  childrenCount: number
  initialized: boolean
  background?: Location
  location: Location
} => {
  const setAdminState = useSetAdminState()
  const setAuthProvider = useSetAuthProvider()
  const setGlobalStrategy = useSetGlobalStrategy()
  const [authProviderInstance, setAuthProviderInstance] = useState<AuthProvider>()
  const childrenCount = useMemo<number>(() => Children.count(children), [children])
  const [initialized, setInitialized] = useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()

  const background = useMemo(() => (location?.state as { background?: Location })?.background, [location?.state])

  useEffect(() => {
    if (childrenCount > 0) {
      setAdminState((state) => ({
        ...state,
        registeredResources: {
          ...state.registeredResources,
          ...(Children.toArray(children).reduce((acc, child) => {
            if (isValidElement(child) && child.type === Resource && child.props.name) {
              const { name } = child.props
              return {
                ...(acc as any),
                [name as string]: {
                  iconName: child.props.icon?.displayName || child.props.icon?.name,
                  hasCreate: !!child.props.create,
                  hasEdit: !!child.props.edit,
                  hasShow: !!child.props.show,
                  hasList: !!child.props.list,
                },
              }
            }
            return acc
          }, {}) as RegisteredResources),
        },
        initialized: true,
      }))

      // register icons
      Children.toArray(children).forEach((child) => {
        if ((child as React.ReactElement).props.icon?.displayName || (child as React.ReactElement).props.icon?.name) {
          const { icon } = (child as React.ReactElement).props
          registeredIcons[icon.displayName || icon.name] = icon
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

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
      setGlobalStrategy(strategy)
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
