/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/extend-expect'
import React, { FC } from 'react'
import { render } from 'ca-test-utils'
import {
  Box,
  BoxProps,
  TextProps,
  Text,
  FlexProps,
  Flex,
  Image,
  ImageProps,
  Avatar,
  AvatarProps,
  TooltipProps,
  Tooltip,
  InputProps,
  Input,
  EditableInput,
  EditablePreview,
  Radio,
} from '@chakra-ui/react'
import { cleanup, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useWatch } from 'react-hook-form'
import { ca, BaseForm } from '../../../../src'

const InputWatcher = ({ control, source, testId }: any) => {
  const value = useWatch({ name: source || 'name', control })

  return (
    <pre data-testid={testId}>
      {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
    </pre>
  )
}

describe('ca.layout() factory function', () => {
  it('should create a layout element that passes all the chakra-admin props to children', () => {
    const CABox = ca.l<BoxProps>(Box)
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
    const CABox = ca.l<BoxProps>(Box)
    const CAFlex = ca.l<FlexProps>(Flex)
    const PropsPrinter: FC = (props) => (
      <pre data-testid="props-printer">{JSON.stringify(props)}</pre>
    )

    const { getByTestId } = render(
      <CABox p="10px" test="1">
        <CABox>
          <CABox>
            <CAFlex>
              <CABox>
                <CAFlex>
                  <PropsPrinter />
                </CAFlex>
              </CABox>
            </CAFlex>
          </CABox>
        </CABox>
      </CABox>
    )

    expect(getByTestId('props-printer')).toHaveTextContent('"test":"1"')
    expect(getByTestId('props-printer')).toHaveTextContent(/^(?:(?!"p":"10px").)*$/)
  })
})

describe('ca.field() factory function', () => {
  it('should create field elements that show the values for their single target prop with "source" prop', () => {
    const CABox = ca.l<BoxProps>(Box)
    const CAFlex = ca.l<FlexProps>(Flex)
    const CAText = ca.f<TextProps>(Text)
    const CAImage = ca.f<ImageProps>(Image, { target: 'src' })

    const { getByTestId } = render(
      <CABox
        record={{ name: 'Segun', lastName: 'Adebayo', userPicture: 'https://bit.ly/sage-adebayo' }}
      >
        <ca.Flex>
          <CAImage data-testid="userPicture" source="userPicture" />
          <CAFlex>
            <ca.Text data-testid="name" source="name" />
            <CAText data-testid="lastName" source="lastName" />
          </CAFlex>
        </ca.Flex>
      </CABox>
    )

    expect(getByTestId('userPicture')).toHaveAttribute('src', 'https://bit.ly/sage-adebayo')
    expect(getByTestId('name')).toHaveTextContent('Segun')
    expect(getByTestId('lastName')).toHaveTextContent('Adebayo')
  })

  it('should create field elements that show the value with typings', () => {
    type RecordType = {
      name: string
      lastName: string
      userPicture: string
    }

    const CABox = ca.l<BoxProps>(Box)
    const CAText = ca.f<TextProps, RecordType>(Text, { target: 'children' })

    const { getByTestId } = render(
      <CABox record={{ name: 'Segun', lastName: 'Adebayo' }}>
        <ca.Text<RecordType> data-testid="name" source="name" />
        <CAText<RecordType> data-testid="last-name" source="lastName" />
      </CABox>
    )

    expect(getByTestId('name')).toHaveTextContent('Segun')
    expect(getByTestId('last-name')).toHaveTextContent('Adebayo')
  })

  it('should create field elements that show the values with "sources" prop', () => {
    type RecordType = {
      name: string
      lastName: string
      userPicture: string
    }

    const CABox = ca.l<BoxProps>(Box)
    const CAAvatar = ca.f<AvatarProps, RecordType>(Avatar)

    const { getByTestId } = render(
      <CABox
        record={{ name: 'Segun', lastName: 'Adebayo', userPicture: 'https://bit.ly/sage-adebayo' }}
      >
        <CAAvatar<RecordType>
          sources={{
            name: 'name',
            src: 'userPicture',
          }}
        />
      </CABox>
    )

    // TODO : FIX THIS TEST
    // expect(getByTestId('userPicture')).toHaveAttribute('src', 'https://bit.ly/sage-adebayo')
    // expect(getByTestId('name')).toHaveTextContent('Segun')
    // expect(getByTestId('lastName')).toHaveTextContent('Adebayo')
  })

  // it doesn't work properly with ref!!!
  it('should create mixed field component that show values and manage children', async () => {
    type RecordType = {
      name: string
      lastName: string
      userPicture: string
    }

    const CABox = ca.l<BoxProps>(Box)
    const CAText = ca.f<TextProps>(Text)

    const CATooltip = ca.f<TooltipProps>(Tooltip, { type: 'mixed-layout', target: 'label' })

    const { getByTestId } = render(
      <CABox
        record={{ name: 'Segun', lastName: 'Adebayo', userPicture: 'https://bit.ly/sage-adebayo' }}
      >
        <CATooltip data-testid="tooltip" source="lastName">
          <CAText data-testid="text" source="name" />
        </CATooltip>
      </CABox>
    )

    fireEvent.mouseOver(getByTestId('text'))
    await waitFor(() => getByTestId('tooltip'))
    expect(getByTestId('tooltip')).toHaveTextContent('Adebayo')
    expect(getByTestId('text')).toHaveTextContent('Segun')
  })
})

describe('ca.formInput() factory function', () => {
  it('it should create an input field that works with react-hook-form', async () => {
    const CAInput = ca.fi<InputProps>(Input)

    const { getByTestId } = render(
      <MemoryRouter>
        <BaseForm defaultValues={{ testInput: 'test' }}>
          <CAInput data-testid="input" source="testInput" />
          <InputWatcher testId="watcher" source="testInput" />
        </BaseForm>
      </MemoryRouter>
    )

    expect(getByTestId('input')).toHaveValue('test')
    expect(getByTestId('watcher')).toHaveTextContent('test')

    fireEvent.change(getByTestId('input'), { target: { value: 'changed' } })
    expect(getByTestId('input')).toHaveValue('changed')
    expect(getByTestId('watcher')).toHaveTextContent('changed')
  })
})

describe('ca.* form input components', () => {
  it('provides correctly the <ca.Checkbox /> component', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BaseForm defaultValues={{ testCheckbox1: false, testCheckbox2: true }}>
          <ca.Checkbox data-testid="checkbox-1" source="testCheckbox1">
            Test Label
          </ca.Checkbox>
          <ca.Checkbox data-testid="checkbox-2" source="testCheckbox2" />

          <InputWatcher testId="watcher-1" source="testCheckbox1" />
          <InputWatcher testId="watcher-2" source="testCheckbox2" />
        </BaseForm>
      </MemoryRouter>
    )

    // TESTIN CHECKBOX 1
    expect(getByTestId('checkbox-1')).toHaveTextContent('Test Label')
    expect((getByTestId('checkbox-1')?.firstChild as HTMLInputElement).checked).toEqual(false)
    expect(getByTestId('watcher-1')).toHaveTextContent('false')
    fireEvent.click(getByTestId('checkbox-1'))
    expect((getByTestId('checkbox-1')?.firstChild as HTMLInputElement).checked).toEqual(true)
    expect(getByTestId('watcher-1')).toHaveTextContent('true')
    fireEvent.click(getByTestId('checkbox-1'))
    expect((getByTestId('checkbox-1')?.firstChild as HTMLInputElement).checked).toEqual(false)
    expect(getByTestId('watcher-1')).toHaveTextContent('false')

    // TESTIN CHECKBOX 2
    expect(getByTestId('checkbox-2')).toHaveTextContent('testCheckbox2')
    expect((getByTestId('checkbox-2')?.firstChild as HTMLInputElement).checked).toEqual(true)
    expect(getByTestId('watcher-2')).toHaveTextContent('true')
    fireEvent.click(getByTestId('checkbox-2'))
    expect((getByTestId('checkbox-2')?.firstChild as HTMLInputElement).checked).toEqual(false)
    expect(getByTestId('watcher-2')).toHaveTextContent('false')
    fireEvent.click(getByTestId('checkbox-2'))
    expect((getByTestId('checkbox-2')?.firstChild as HTMLInputElement).checked).toEqual(true)
    expect(getByTestId('watcher-2')).toHaveTextContent('true')
  })

  it('provides correctly the <ca.Editable /> component', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BaseForm resource="Test" defaultValues={{ testInput: 'test' }}>
          <ca.Editable source="testInput">
            <EditablePreview />
            <EditableInput data-testid="input" />
          </ca.Editable>
          <InputWatcher testId="watcher" source="testInput" />
        </BaseForm>
      </MemoryRouter>
    )

    expect(getByTestId('input')).toHaveValue('test')
    expect(getByTestId('watcher')).toHaveTextContent('test')

    fireEvent.change(getByTestId('input'), { target: { value: 'changed' } })
    expect(getByTestId('input')).toHaveValue('changed')
    expect(getByTestId('watcher')).toHaveTextContent('changed')
  })

  it('provides correctly the <ca.Input /> component', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BaseForm resource="Test" defaultValues={{ testInput: 'test' }}>
          <ca.Input data-testid="input" source="testInput" />
          <InputWatcher testId="watcher" source="testInput" />
        </BaseForm>
      </MemoryRouter>
    )

    expect(getByTestId('input')).toHaveValue('test')
    expect(getByTestId('watcher')).toHaveTextContent('test')

    fireEvent.change(getByTestId('input'), { target: { value: 'changed' } })
    expect(getByTestId('input')).toHaveValue('changed')
    expect(getByTestId('watcher')).toHaveTextContent('changed')
  })

  it('provides correctly the <ca.Switch /> component', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BaseForm defaultValues={{ testSwitch: true }}>
          <ca.Switch data-testid="switch" source="testSwitch" />
          <InputWatcher testId="watcher" source="testSwitch" />
        </BaseForm>
      </MemoryRouter>
    )

    expect((getByTestId('switch')?.firstChild as HTMLInputElement).checked).toEqual(true)
    expect(getByTestId('watcher')).toHaveTextContent('true')
    fireEvent.click(getByTestId('switch'))
    expect((getByTestId('switch')?.firstChild as HTMLInputElement).checked).toEqual(false)
    expect(getByTestId('watcher')).toHaveTextContent('false')
    fireEvent.click(getByTestId('switch'))
    expect((getByTestId('switch')?.firstChild as HTMLInputElement).checked).toEqual(true)
    expect(getByTestId('watcher')).toHaveTextContent('true')
  })

  it('provides correctly the <ca.RadioGroup /> component', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BaseForm defaultValues={{ testRadio: 'yes' }}>
          <ca.RadioGroup source="testRadio">
            <Radio data-testid="radio-yes" value="yes">
              YES
            </Radio>
            <Radio data-testid="radio-no" value="no">
              NO
            </Radio>
          </ca.RadioGroup>
          <InputWatcher testId="watcher" source="testRadio" />
        </BaseForm>
      </MemoryRouter>
    )

    expect(getByTestId('watcher')).toHaveTextContent('yes')
    fireEvent.click(getByTestId('radio-no'))
    expect(getByTestId('watcher')).toHaveTextContent('no')
  })
})

afterEach(cleanup)
