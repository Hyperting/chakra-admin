import * as React from 'react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { Admin, Resource } from 'chakra-admin'
import { ExampleStrategy } from './ExampleStrategy'
import { CursorCompanyList, CursorCompanyWithTotal, OffsetCompanyList } from './resources/Company'
import { client } from './apolloClient'

export const App = () => (
  <ChakraProvider theme={theme}>
    <Admin client={client} strategy={ExampleStrategy}>
      <Resource {...(OffsetCompanyList as any)} />
      <Resource {...(CursorCompanyList as any)} />
      <Resource {...(CursorCompanyWithTotal as any)} />
      {/* <Route path="my-custom-route" element={<>My Custom Route</>} /> */}
    </Admin>
  </ChakraProvider>
)
