import { FC } from 'react'
import { Create, BaseForm, Input } from 'chakra-admin'
import { gql } from '@apollo/client'
import { Button, FormControl, FormHelperText, FormLabel, HStack, useToast } from '@chakra-ui/react'

const MUTATION_CREATE_COMPANY = gql`
  mutation CreateCompany($data: CreateCompanyInput!) {
    createCompany(data: $data) {
      id
      name
    }
  }
`

export const CompanyCreate: FC = (props) => {
  const toast = useToast()
  return (
    <Create mutation={MUTATION_CREATE_COMPANY} {...props}>
      <BaseForm>
        <Button
          onClick={() => {
            toast({
              title: 'Company created',
              status: 'success',
              duration: 9000,
              isClosable: true,
            })
          }}
        >
          Click me
        </Button>
        <HStack spacing={4} pr={4} mb={5}>
          <FormControl>
            <FormLabel htmlFor="name">Company Name</FormLabel>
            <Input id="name" type="text" source="name" />
            <FormHelperText>We'll never share your company name.</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="industry">Industry</FormLabel>
            <Input id="industry" type="text" source="industry" />
            <FormHelperText>We'll never share your industry name.</FormHelperText>
          </FormControl>
        </HStack>
      </BaseForm>
    </Create>
  )
}
