/* eslint-disable import/no-anonymous-default-export */
import { CompanyCreate } from './CompanyCreate'
import { CompanyEdit } from './CompanyEdit'
import { RoleList } from './CompanyList'

export default {
  name: 'Role',
  list: RoleList,
  create: CompanyCreate,
  edit: CompanyEdit,
}
