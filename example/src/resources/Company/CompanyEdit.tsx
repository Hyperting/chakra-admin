import React, { FC } from 'react'
import { Edit, BaseForm, Input } from 'chakra-admin'

const QUERY_GET_COMPANY = /* GraphQL */ `
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
    }
  }
`

const MUTATION_UPDATE_COMPANY = /* GraphQL */ `
  mutation UpdateCompany($id: ID!, $input: CompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
    }
  }
`

export const CompanyEdit: FC = (props) => {
  return (
    <Edit query={QUERY_GET_COMPANY} mutation={MUTATION_UPDATE_COMPANY} {...props}>
      <BaseForm>
        <Input placeholder="Nome" source="name" />
      </BaseForm>
    </Edit>
  )
}
