import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { Box, BoxProps, Flex, Stat } from '@chakra-ui/react'
import { EMPTY_QUERY, useGqlBuilder } from '../../../../src/core/graphql/gql-builder'
import { ca } from '../../../../src/core/react'

type FakeFieldProps = {
  source?: string
  sources?: Partial<Record<keyof Partial<BoxProps>, any>>
}

const CustomLayoutComponent = ({ children }) => {
  return <>{children}</>
}

const FakeField = (props: FakeFieldProps) => {
  return null
}

describe('useGqlBuilder()', () => {
  it('should collect correctly all the fields', () => {
    const children = [
      <FakeField key="1" source="test" />,
      <Box key="2">
        <Flex>
          <Box>
            <Flex>
              <FakeField sources={{ bgColor: 'bgColorSource' }} />
              <Box>
                <Flex>
                  <Stat>
                    <ca.StatHelpText source="innerMixedTest">
                      <FakeField source="innerTest" />
                    </ca.StatHelpText>
                  </Stat>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>,
      <CustomLayoutComponent key="3">
        <FakeField source="includedInnerTest" />
      </CustomLayoutComponent>,
    ]

    const { result } = renderHook(() =>
      useGqlBuilder({
        resource: 'FakeResource',
        type: 'query',
        operation: 'fakeQuery',
        generateGql: (fields) => EMPTY_QUERY,
        children,
      })
    )

    expect(result.current?.selectionSet).toHaveLength(5)
    console.log(result.current, 'sono io vé')
  })
})
