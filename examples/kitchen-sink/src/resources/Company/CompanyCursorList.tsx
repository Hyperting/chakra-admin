import { FC } from 'react'
import {
  DataTable,
  Filters,
  Input,
  List,
  DataTableValue as Field,
  ListToolbar,
  CreateButton,
  AutocompleteInput,
} from 'chakra-admin'
import { gql } from '@apollo/client'

const QUERY_GET_COMPANIES = gql`
  query GetCursorCompanies(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $revert: Boolean
    $sortBy: CompaniesSortByKeys
    $filters: CompanyFilterInput
  ) {
    result: cursorCompanies(
      after: $after
      before: $before
      first: $first
      last: $last
      revert: $revert
      sortBy: $sortBy
      filters: $filters
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          name
        }
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
      emptyLabel="Tutti gli account manager"
      showEmptyState
      query={QUERY_GET_COMPANIES}
      source="accountManagerId"
      label=""
      placeholder="Cerca per account manager..."
      labelStyleProps={{ fontSize: 'md', fontWeight: '600', mt: '2', pb: '2' }}
      showFormControl={false}
      alwaysOn
      minW="300px"
      inputValueToFilters={(q: string) => ({ q })}
      dataItemToAutocompleteItem={(data) => ({
        ...data,
        label: `${data.firstName} ${data.lastName}`,
        value: data.id,
      })}
      inputStyleProps={{ borderRadius: 'lg' }}
    />
  </Filters>
)

export const CompanyCursorList: FC = (props) => {
  return (
    <List
      {...props}
      defaultPerPage={5}
      paginationMode="cursor"
      query={QUERY_GET_COMPANIES}
      deleteItemMutation={MUTATION_DELETE_COMPANY}
      filtersComponent={<CompanyFilters />}
      toolbarComponent={
        <ListToolbar>
          <CreateButton openAsModal />
        </ListToolbar>
      }
    >
      <DataTable>
        <Field source="id" label="ID" />
        <Field source="name" label="Name" />
      </DataTable>
    </List>
  )
}
