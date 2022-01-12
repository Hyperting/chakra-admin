import React, { FC } from 'react'
import { Create, BaseForm, Input } from 'chakra-admin'
import { gql } from '@apollo/client'

const MUTATION_CREATE_COMPANY = gql`
  mutation CreateCompany($data: CreateCompanyInput!) {
    createCompany(data: $data) {
      id
      name
    }
  }
`

export const CompanyCreate: FC = (props) => {
  return (
    <Create mutation={MUTATION_CREATE_COMPANY} {...props}>
      <BaseForm>
        <Input placeholder="Name" source="name" />
        <Input placeholder="Industry" source="industry" />
      </BaseForm>
    </Create>
  )
}
