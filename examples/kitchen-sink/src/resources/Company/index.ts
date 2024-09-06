/* eslint-disable import/no-anonymous-default-export */
import { CompanyCreate } from './CompanyCreate'
import { CompanyCursorList } from './CompanyCursorList'
import { CompanyCursorWithTotalList } from './CompanyCursorWithTotalList'
import { CompanyEdit } from './CompanyEdit'
import { CompanyList } from './CompanyList'
import { CompanyShow } from './CompanyShow'

const Company = {
  create: CompanyCreate,
  edit: CompanyEdit,
  show: CompanyShow,
}

const OffsetCompanyList = {
  ...Company,
  name: 'OffsetCompany',
  list: CompanyList,
}

const CursorCompanyList = {
  ...Company,
  name: 'CursorsCompany',
  list: CompanyCursorList,
}

const CursorCompanyWithTotal = {
  ...Company,
  name: 'CursorsCompanyWithTotal',
  list: CompanyCursorWithTotalList,
}

export { CursorCompanyList, OffsetCompanyList, CursorCompanyWithTotal }
