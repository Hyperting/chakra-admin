import React, { FC, useMemo } from 'react'
import { BrowserRouter as Router, BrowserRouterProps, useLocation, useNavigate } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { QueryParamProvider } from 'use-query-params'
import { I18nProvider, I18nProviderProps, defaultI18n, getDefaultI18nOptions, en as enLanguage } from 'ca-i18n'
import { AdminCore, AdminCoreProps } from './AdminCore'
import { ErrorBoundary } from '../base/error-boundary'

const RouteAdapter: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const adaptedHistory = useMemo(
    () => ({
      replace(location) {
        navigate(location, { replace: true, state: location.state })
      },
      push(location) {
        navigate(location, { replace: false, state: location.state })
      },
    }),
    [navigate]
  )
  return (children as any)({ history: adaptedHistory, location })
}

export type AdminProps<TCache> = AdminCoreProps & {
  client: ApolloClient<TCache>
  loadingComponent?: React.ReactNode
  i18nProviderProps?: Omit<I18nProviderProps, 'fallback'>
} & Pick<BrowserRouterProps, 'basename' | 'window'>

/**
 * Main entry point for the admin panel.
 *
 * It initialize the apollo client, the authProvider, the layout of the application and the routes.
 *
 * @example
 *
 * // basic example
 *
 * import { Admin, Resource } from 'chakra-admin'
 *
 * const App = () => (
 *  <Admin makeClient={createGraphqlClient}>
 *    <Resource name="Company" list={CompanyList} />
 *  </Admin>
 * )
 *
 * // with custom routes
 * import { Admin, Resource } from 'chakra-admin'
 *
 * const App = () => (
 * <Admin makeClient={createGraphqlClient}>
 *  <Resource name="Company" list={CompanyList} />
 *  <Route path="my-custom-route" element={<>My Custom Route</>} />
 * </Admin>
 *
 */
export const Admin: FC<AdminProps<any>> = ({
  client,
  loadingComponent,
  i18nProviderProps = {
    i18n: defaultI18n,
    options: getDefaultI18nOptions({ en: enLanguage }),
  },
  basename,
  window,
  ...props
}) => {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <I18nProvider {...(i18nProviderProps as any)} fallback={loadingComponent}>
            <Router basename={basename} window={window}>
              <QueryParamProvider ReactRouterRoute={RouteAdapter}>
                <AdminCore {...props} />
              </QueryParamProvider>
            </Router>
          </I18nProvider>
        </ApolloProvider>
      </RecoilRoot>
    </ErrorBoundary>
  )
}
