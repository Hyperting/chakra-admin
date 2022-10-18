import { FC } from 'react'
import {
  DataTable,
  Filters,
  Input,
  List,
  SortDirection,
  DataTableValue as Field,
  ListToolbar,
  CreateButton,
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
    cursorCompanies(
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
  </Filters>
)

export const CompanyCursorList: FC = (props) => {
  return (
    <List
      {...props}
      paginationMode="cursor"
      query={QUERY_GET_COMPANIES}
      deleteItemMutation={MUTATION_DELETE_COMPANY}
      filtersComponent={<CompanyFilters />}
      defaultSorting={{ name: SortDirection.ASC }}
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
