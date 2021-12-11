import React, { FC } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { AdminCore, AdminCoreProps } from './AdminCore'
import { ClientProvider } from '../UrqlClientProvider'
import { Client } from 'urql'

type Props = AdminCoreProps & { makeClient: () => Client }

export const Admin: FC<Props> = ({ makeClient, ...props }) => {
  return (
    <RecoilRoot>
      <ClientProvider makeClient={makeClient}>
        <Router>
          <AdminCore {...props} />
        </Router>
      </ClientProvider>
    </RecoilRoot>
  )
}
