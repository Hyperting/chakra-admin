/* eslint-disable react/jsx-key */
import React, { FC } from 'react'
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
} from 'chakra-admin'
import { gql } from '@apollo/client'

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
      <DataTable>
        <Field source="id" label="ID" />
        <Field source="name" label="Name" />
      </DataTable>
    </List>
  )
}
