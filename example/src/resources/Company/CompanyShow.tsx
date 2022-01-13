import React, { FC } from 'react'
import { Input, Show, caField } from 'chakra-admin'
import { gql } from '@apollo/client'
import { Avatar, AvatarProps, Box, Text, TextProps } from '@chakra-ui/react'

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

const CAText = caField<TextProps>(Text)
const CAAvatar = caField<AvatarProps>(Avatar, { targetProp: 'name' })

export const CompanyShow: FC = (props) => {
  return (
    <Show query={QUERY_GET_COMPANY} mutation={MUTATION_UPDATE_COMPANY} {...props}>
      <Box d="flex">
        <CAAvatar source="id" />
        <Box ml={4}>
          <CAText source="name" />
          <CAText color="gray.600" fontSize="sm" source="industry" />
        </Box>
      </Box>
    </Show>
  )
}
