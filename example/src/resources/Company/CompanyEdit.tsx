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
  mutation UpdateCompany($id: ID!, $data: UpdateCompanyInput!) {
    updateCompany(id: $id, data: $data) {
      id
      name
    }
  }
`

export const CompanyEdit: FC = (props) => {
  return (
    <Edit query={QUERY_GET_COMPANY} mutation={MUTATION_UPDATE_COMPANY} {...props}>
      <BaseForm>
        <Input placeholder="Name" source="name" />
        <Input placeholder="Industry" source="industry" />
      </BaseForm>
    </Edit>
  )
}
