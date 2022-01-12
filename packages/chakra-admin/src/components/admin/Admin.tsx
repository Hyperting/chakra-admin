import React, { FC } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { AdminCore, AdminCoreProps } from './AdminCore'

export type AdminProps<TCache> = AdminCoreProps & { client: ApolloClient<TCache> }

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
export const Admin: FC<AdminProps<any>> = ({ client, ...props }) => {
  return (
    <RecoilRoot>
      <ApolloProvider client={client}>
        <Router>
          <AdminCore {...props} />
        </Router>
      </ApolloProvider>
    </RecoilRoot>
  )
}
