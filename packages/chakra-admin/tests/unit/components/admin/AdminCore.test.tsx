import React from 'react'
import { render, expectToThrow } from 'ca-test-utils'
import { AdminCore } from '../../../../src/components/admin/AdminCore'

describe('<AdminCore />', () => {
  it('should throw an error if no children are provided', () => {
    expectToThrow(() => render(<AdminCore />))
  })
})
