import React, { FC } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { Client } from 'urql'
import { AdminCore, AdminCoreProps } from './AdminCore'
import { ClientProvider } from '../UrqlClientProvider'

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
