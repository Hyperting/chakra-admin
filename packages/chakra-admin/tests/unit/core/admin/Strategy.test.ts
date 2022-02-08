import { DefaultListStrategy } from '../../../../src'

describe('DefaultStrategy', () => {
  describe('DefaultListStrategy', () => {
    describe('DefaultListStrategy.getQuery()', () => {
      it('should generate correctly a simple query', () => {
        const strategy = new DefaultListStrategy()

        const query = strategy.getQuery('Company', 'companies', undefined, ['id', 'name'])

        console.log((query?.definitions?.[0] as any)?.selectionSet?.selections?.[0])
        expect((query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.name?.value).toBe(
          'companies'
        )
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[0]?.name?.value
        ).toBe('id')
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[1]?.name?.value
        ).toBe('name')
      })

      it('should generate correctly a nested query', () => {
        const strategy = new DefaultListStrategy()

        const query = strategy.getQuery('Company', 'companies', undefined, [
          'id',
          'people.firstName',
          'people.lastName',
          'people.address.street',
        ])

        console.log(query, 'cia')

        console.log((query?.definitions?.[0] as any)?.selectionSet?.selections?.[0])
        expect((query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.name?.value).toBe(
          'companies'
        )
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[0]?.name?.value
        ).toBe('id')
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[1]?.name?.value
        ).toBe('id')
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[1]?.selectionSet?.selections?.[0]?.name?.value
        ).toBe('firstName')
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[1]?.selectionSet?.selections?.[1]?.name?.value
        ).toBe('lastName')
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[1]?.selectionSet?.selections?.[2]?.name?.value
        ).toBe('address')
        expect(
          (query?.definitions?.[0] as any)?.selectionSet?.selections?.[0]?.selectionSet
            ?.selections?.[1]?.selectionSet?.selections?.[2]?.selectionSet?.selections?.[0]?.name
            ?.value
        ).toBe('street')
      })
    })
  })
})
