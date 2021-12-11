import * as React from 'react'
import { Button, ChakraProvider } from '@chakra-ui/react'
// import { ColorModeSwitcher } from './ColorModeSwitcher'
import { Admin, Resource } from 'chakra-admin'
import Company from './resources/Company'
import { createGraphqlClient } from './graphqlClient'
import { theme } from 'ca-theme'
import '@fontsource/sora'

export const App = () => (
  <ChakraProvider theme={theme}>
    {/* <pre>{JSON.stringify(theme, null, 2)}</pre> */}
    <Admin makeClient={createGraphqlClient}>
      <Resource {...Company} />
    </Admin>
  </ChakraProvider>
)
