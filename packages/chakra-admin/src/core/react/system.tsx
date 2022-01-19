import { caLayout, CALayoutComponents } from './system-layout'
import { caField, CAFieldComponents } from './system-field'
import { caFormInput, CAFormComponents } from './system-form-input'

export type CA = {
  layout: typeof caLayout
  l: typeof caLayout
  field: typeof caField
  f: typeof caField
  formInput: typeof caFormInput
  fi: typeof caFormInput
}

export const ca = ({
  layout: caLayout,
  l: caLayout,
  field: caField,
  f: caField,
  formInput: caFormInput,
  fi: caFormInput,
  ...CALayoutComponents,
  ...CAFieldComponents,
  ...CAFormComponents,
} as unknown) as CA & typeof CALayoutComponents & typeof CAFieldComponents & typeof CAFormComponents
