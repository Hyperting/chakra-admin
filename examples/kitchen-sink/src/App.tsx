import * as React from 'react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { Admin, Resource } from 'chakra-admin'
import { ExampleStrategy } from './ExampleStrategy'
import { CursorCompanyList, CursorCompanyWithTotal, OffsetCompanyList } from './resources/Company'
import { client } from './apolloClient'
import { ExampleAuthProvider } from './ExampleAuth'
import { Route } from 'react-router-dom'

// const routeMiddleware = (client: ApolloClient<any>) => {
//   return '/onboarding'
// }

export const App = () => (
  <ChakraProvider theme={theme}>
    <Admin client={client} strategy={ExampleStrategy} authProvider={ExampleAuthProvider}>
      <Resource {...(OffsetCompanyList as any)} />
      <Resource {...(CursorCompanyList as any)} /* routeMiddleware={routeMiddleware} */ />
      <Resource {...(CursorCompanyWithTotal as any)} />
      <Route path="onboarding" element={<div>Onboarding Page!</div>} />
    </Admin>
  </ChakraProvider>
)
