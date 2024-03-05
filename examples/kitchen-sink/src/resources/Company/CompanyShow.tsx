import { FC } from 'react'
import { Show, ca } from 'chakra-admin/'
import { gql } from '@apollo/client'
import { Box } from '@chakra-ui/react'

const QUERY_GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      industry
    }
  }
`

const MUTATION_UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $data: UpdateCompanyInput!) {
    updateCompany(id: $id, data: $data) {
      id
      name
      industry
    }
  }
`

export const CompanyShow: FC = (props) => {
  return (
    <Show query={QUERY_GET_COMPANY} mutation={MUTATION_UPDATE_COMPANY} {...props}>
      <Box display="flex">
        <ca.Avatar source="id" />
        <Box ml={4}>
          <ca.Text source="name" />
          <ca.Text color="gray.600" fontSize="sm" source="industry" />
        </Box>
      </Box>
    </Show>
  )
}
