import React from 'react'
import { Provider } from 'urql'

const ClientContext = React.createContext({
  // this is just to satisfy the TS compiler.
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClientProvider({ makeClient, children }: any) {
  const [client, setClient] = React.useState(makeClient())

  return (
    <ClientContext.Provider
      value={{
        resetClient: () => setClient(makeClient()),
      }}
    >
      <Provider value={client}>{children}</Provider>
    </ClientContext.Provider>
  )
}

export const useClient = () => React.useContext(ClientContext)
