import * as React from 'react'
import { Admin, Resource } from 'chakra-admin'
import Company from './resources/Company'
import { createGraphqlClient } from './graphqlClient'
import '@fontsource/sora'
import { ChakraProvider, theme } from '@chakra-ui/react'

export const App = () => (
  <ChakraProvider theme={theme}>
    <Admin makeClient={createGraphqlClient}>
      <Resource {...Company} />
    </Admin>
  </ChakraProvider>
)
