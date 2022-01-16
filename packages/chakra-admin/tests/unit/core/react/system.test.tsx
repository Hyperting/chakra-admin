/* eslint-disable import/no-extraneous-dependencies */
import React, { FC } from 'react'
import { render } from 'ca-test-utils'
import {
  Box,
  BoxProps,
  TextProps,
  Text,
  FlexProps,
  Flex,
  AvatarProps,
  Avatar,
  Image,
  ImageProps,
} from '@chakra-ui/react'
import { cleanup } from '@testing-library/react'
import { ca, caField } from '../../../../src/core/react/system'
import '@testing-library/jest-dom/extend-expect'

describe('ca factory function', () => {
  it('should create a layout element that passes all the chakra-admin props to children', () => {
    const CABox = ca<BoxProps>(Box)
    const PropsPrinter: FC = (props) => (
      <pre data-testid="props-printer">{JSON.stringify(props)}</pre>
    )

    const { getByTestId } = render(
      <CABox p="10px" test="1">
        <PropsPrinter />
      </CABox>
    )

    expect(getByTestId('props-printer')).toHaveTextContent('"test":"1"')
    expect(getByTestId('props-printer')).toHaveTextContent(/^(?:(?!"p":"10px").)*$/)
  })

  it('should manage nested data correctly', () => {
    const CABox = ca<BoxProps>(Box)
    const PropsPrinter: FC = (props) => (
      <pre data-testid="props-printer">{JSON.stringify(props)}</pre>
    )

    const { getByTestId } = render(
      <CABox p="10px" test="1">
        <CABox>
          <CABox>
            <PropsPrinter />
          </CABox>
        </CABox>
      </CABox>
    )

    expect(getByTestId('props-printer')).toHaveTextContent('"test":"1"')
    expect(getByTestId('props-printer')).toHaveTextContent(/^(?:(?!"p":"10px").)*$/)
  })
})

describe('caField factory function', () => {
  it('should create a field element that show the value as a child', () => {
    type RecordType = {
      name: string
      lastName: string
      userPicture: string
    }

    const CABox = ca<BoxProps>(Box)
    const CAFlex = ca<FlexProps>(Flex)
    const CAText = caField<TextProps>(Text)
    const CAImage = caField<ImageProps>(Image, { targetProp: 'src' })

    const { getByTestId } = render(
      <CABox
        record={{ name: 'Segun', lastName: 'Adebayo', userPicture: 'https://bit.ly/sage-adebayo' }}
      >
        <CAFlex>
          <CAImage<RecordType> data-testid="userPicture" source="userPicture" />
          <CAFlex>
            <CAText<RecordType> data-testid="name" source="name" />
            <CAText<RecordType> data-testid="lastName" source="lastName" />
          </CAFlex>
        </CAFlex>
      </CABox>
    )

    expect(getByTestId('userPicture')).toHaveAttribute('src', 'https://bit.ly/sage-adebayo')
    expect(getByTestId('name')).toHaveTextContent('Segun')
    expect(getByTestId('lastName')).toHaveTextContent('Adebayo')
  })
})

afterEach(cleanup)
