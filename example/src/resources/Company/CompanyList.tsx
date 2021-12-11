/* eslint-disable react/jsx-key */
import React, { FC } from 'react'
import { FaUser } from 'react-icons/fa'
import {
  DataTable,
  Filters,
  Input,
  List,
  PageTitle,
  SortDirection,
  DataTableValue as Field,
} from 'chakra-admin'

const QUERY_GET_COMPANIES = /* GraphQL */ `
  query GetCompanies(
    $pagination: PaginationInput
    $sort: CompanySortInput
    $filters: CompanyFilterInput
  ) {
    companies(pagination: $pagination, sort: $sort, filters: $filters) {
      total
      data {
        id
        name
      }
    }
  }
`

const MUTATION_DELETE_COMPANY = /* GraphQL */ `
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`

const CompanyFilters: FC = (props) => (
  <Filters {...props}>
    <Input source="name" label="name" alwaysOn />
  </Filters>
)

export const CompanyList: FC = (props) => {
  return (
    <List
      {...props}
      query={QUERY_GET_COMPANIES}
      deleteItemMutation={MUTATION_DELETE_COMPANY}
      titleComponent={<PageTitle icon={FaUser} label="Companies" />}
      filtersComponent={<CompanyFilters />}
      defaultSorting={{ name: SortDirection.ASC }}
      listComponent={<DataTable />}
    >
      <Field source="id" label="ID" />
      <Field source="name" label="Name" />
    </List>
  )
}
