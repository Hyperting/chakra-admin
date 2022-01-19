/* eslint-disable react/require-default-props */
import * as React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ChakraProvider, theme } from '@chakra-ui/react'
// eslint-disable-next-line import/no-extraneous-dependencies

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }
