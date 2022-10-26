import {
  caLayout,
  CALayoutComponents,
  getRegisteredLayoutComponents,
  registerLayoutComponent,
  removeLayoutComponent,
  useRegisterLayoutComponent,
} from './system-layout'
import { caField, CAFieldComponents, CAFieldOptions, CAFieldProps } from './system-field'
import { caFormInput, CAFormComponents, CAFormControlComponents, CAInputOptions, CAInputProps } from './system-form'

export type CA = {
  layout: typeof caLayout
  l: typeof caLayout
  field: typeof caField
  f: typeof caField
  formInput: typeof caFormInput
  fi: typeof caFormInput
} & typeof CALayoutComponents &
  typeof CAFieldComponents &
  typeof CAFormComponents &
  typeof CAFormControlComponents

export const ca: CA = {
  layout: caLayout,
  l: caLayout,
  field: caField,
  f: caField,
  formInput: caFormInput,
  fi: caFormInput,
  ...CALayoutComponents,
  ...CAFieldComponents,
  ...CAFormComponents,
  ...CAFormControlComponents,
}

export { useRegisterLayoutComponent, getRegisteredLayoutComponents, registerLayoutComponent, removeLayoutComponent }
export type { CAFieldOptions, CAFieldProps, CAInputOptions, CAInputProps }
