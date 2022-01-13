/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, expectToThrow } from 'ca-test-utils'
import { cleanup } from '@testing-library/react'
import { AdminCore } from '../../../../src/components/admin/AdminCore'

describe('<AdminCore />', () => {
  it('should throw an error if no children are provided', () => {
    expectToThrow(() => render(<AdminCore />))
  })
})

afterEach(cleanup)
