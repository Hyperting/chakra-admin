import React, { FC } from 'react'
import { Create, BaseForm, Input } from 'chakra-admin'

const MUTATION_CREATE_COMPANY = /* GraphQL */ `
  mutation CreateCompany($input: CreateCompany!) {
    createCompany(input: $input) {
      id
      name
    }
  }
`

export const CompanyCreate: FC = (props) => {
  return (
    <Create mutation={MUTATION_CREATE_COMPANY} {...props}>
      <BaseForm>
        <Input placeholder="E-mail" source="email" />
        <Input placeholder="Password" source="password" type="password" />
        <Input placeholder="Nome" source="firstName" />
        <Input placeholder="Cognome" source="lastName" />
      </BaseForm>
    </Create>
  )
}
