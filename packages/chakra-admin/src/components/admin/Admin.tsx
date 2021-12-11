import React, { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import {
  HyperThemeEditor,
  InspectorProvider,
  ThemeEditorProvider,
} from '@hypertheme-editor-pro/chakra-ui'
import { theme } from '../../theme'
import { AdminCore, AdminCoreProps } from './AdminCore'
import { ClientProvider } from '../UrqlClientProvider'
import { createUrqlClient } from '../../urqlClient'

type Props = AdminCoreProps

export const Admin: FC<Props> = (props) => {
  return (
    <RecoilRoot>
      <ClientProvider makeClient={createUrqlClient}>
        <ChakraProvider theme={theme}>
          <ThemeEditorProvider>
            <InspectorProvider />
            <Router>
              <AdminCore {...props} />
            </Router>
            <HyperThemeEditor pos="absolute" bottom={2} right={2} />
          </ThemeEditorProvider>
        </ChakraProvider>
      </ClientProvider>
    </RecoilRoot>
  )
}
