/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChakraProvider, theme } from '@chakra-ui/react'
import { Admin, Resource, Route } from 'chakra-admin'
import { ExampleStrategy } from './ExampleStrategy'
import { CursorCompanyList, CursorCompanyWithTotal, OffsetCompanyList } from './resources/Company'
import { client } from './apolloClient'
import { ExampleAuthProvider } from './ExampleAuth'

export const App = () => {
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
