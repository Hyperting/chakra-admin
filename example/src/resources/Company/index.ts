/* eslint-disable import/no-anonymous-default-export */
import { CompanyCreate } from './CompanyCreate'
import { CompanyEdit } from './CompanyEdit'
import { CompanyList } from './CompanyList'

export default {
  name: 'Company',
  list: CompanyList,
  create: CompanyCreate,
  edit: CompanyEdit,
}
