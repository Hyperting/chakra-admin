import React, { FC } from 'react'
import { Edit, BaseForm, Input, caField, ca } from 'chakra-admin'
import { gql } from '@apollo/client'
import { Avatar, AvatarProps, Box, TextProps, Text, Flex, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'

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

const TestAvatar: FC = ({...props}) => {
  return (
    <Flex mb={4}>
        <CAAvatar source="id" {...props} />
        <Box ml={4}>
          <CAText source="name" {...props} />
          <CAText {...props} color="gray.600" fontSize="sm" source="industry" />
        </Box>
      </Flex>
  )
}

export const CompanyEdit: FC = (props) => {
  return (
    <Edit query={QUERY_GET_COMPANY} mutation={MUTATION_UPDATE_COMPANY} {...props}>
      <Flex mb={4}>
        <CAAvatar source="id" />
        <Box ml={4}>
          <CAText source="name" />
          <CAText color="gray.600" fontSize="sm" source="industry" />
        </Box>
      </Flex>

      <BaseForm>
      <FormControl>
        <FormLabel htmlFor='name'>Company Name</FormLabel>
        <Input id='name' type='text' source="name" />
        <FormHelperText>We'll never share your company name.</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor='industry'>Industry</FormLabel>
        <Input id='industry' type='text' source="industry" />
        <FormHelperText>We'll never share your industry name.</FormHelperText>
      </FormControl>
      </BaseForm>
    </Edit>
  )
}
