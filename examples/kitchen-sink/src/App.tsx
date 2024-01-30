import * as React from 'react'
import { Button, ChakraProvider, theme, useToast } from '@chakra-ui/react'
import { Admin, Resource, Route } from 'chakra-admin'
import { ExampleStrategy } from './ExampleStrategy'
import { CursorCompanyList, CursorCompanyWithTotal, OffsetCompanyList } from './resources/Company'
import { client } from './apolloClient'
import { ExampleAuthProvider } from './ExampleAuth'

// const routeMiddleware = (client: ApolloClient<any>) => {
//   return '/onboarding'
// }

export const App = () => {
  const toast = useToast()
  return (
    <ChakraProvider theme={theme}>
      <Admin client={client} strategy={ExampleStrategy} authProvider={ExampleAuthProvider}>
        <Resource {...(OffsetCompanyList as any)} />
        <Resource {...(CursorCompanyList as any)} /* routeMiddleware={routeMiddleware} */ />
        <Resource {...(CursorCompanyWithTotal as any)} />
        <Route useAdminLayout path="onboarding" element={<div>Onboarding Page!</div>} />
      </Admin>
    </ChakraProvider>
  )
}
