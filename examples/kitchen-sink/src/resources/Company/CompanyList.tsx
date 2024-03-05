/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import {
  DataTable,
  Filters,
  Input,
  List,
  OffsetSortDirection,
  DataTableValue as Field,
  ListToolbar,
  CreateButton,
  AutocompleteInput,
  GenericMoreMenuButton,
} from 'chakra-admin'
import { BsFillEyeFill } from 'react-icons/bs'
import { gql } from '@apollo/client'
import { Button, Icon } from '@chakra-ui/react'

const QUERY_GET_COMPANIES = gql`
  query GetCompanies($pagination: PaginationInput, $sort: CompanySortInput, $filters: CompanyFilterInput) {
    companies(pagination: $pagination, sort: $sort, filters: $filters) {
      total
      data {
        id
        name
      }
    }
  }
`

const MUTATION_DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`

const CompanyFilters: FC = (props) => (
  <Filters {...props}>
    <Input source="name" label="name" alwaysOn />
    <AutocompleteInput
      alwaysOn
      emptyLabel="Tutti i clienti"
      showEmptyState
      query={QUERY_GET_COMPANIES as any}
      source="id"
      label=""
      placeholder="Cerca cliente"
      perPage={20}
      labelStyleProps={{ fontSize: 'md', fontWeight: '600', mt: '2', pb: '2' }}
      showFormControl={false}
      maxW="300px"
      inputValueToFilters={(q: string) => ({ name: q })}
      dataItemToAutocompleteItem={(data: any) => ({
        ...data,
        label: data.name || `${data.firstName} ${data.lastName}`,
        value: data.id,
      })}
      inputStyleProps={{ borderRadius: 'lg' }}
      listStyleProps={{ borderRadius: 'lg' }}
    />
    <div>Control</div>
  </Filters>
)

export const CompanyList: FC = (props) => {
  return (
    <List
      {...props}
      query={QUERY_GET_COMPANIES}
      defaultPerPage={20}
      deleteItemMutation={MUTATION_DELETE_COMPANY}
      filtersComponent={<CompanyFilters />}
      defaultSorting={{ name: OffsetSortDirection.ASC }}
      toolbarComponent={
        <ListToolbar>
          <CreateButton openAsModal />
        </ListToolbar>
      }
    >
      <DataTable
        tableProps={{
          size: 'sm',
        }}
        moreMenuComponent={
          <GenericMoreMenuButton>
            <Button
              variant="unstyled"
              width="100%"
              pt="1.5"
              pb="1.5"
              pl="3"
              pr="3"
              borderRadius="none"
              display="flex"
              fontWeight="normal"
              justifyContent="flex-start"
              _hover={{ bg: 'gray.100' }}
              leftIcon={<Icon as={BsFillEyeFill} />}
            >
              Prova
            </Button>
          </GenericMoreMenuButton>
        }
      >
        <Field source="id" label="ID" />
        <Field source="name" label="Name" />
      </DataTable>
    </List>
  )
}
