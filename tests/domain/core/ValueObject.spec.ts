import { ValueObject } from '@domain/core'

class FakeValueObject extends ValueObject<object> {
  constructor(value: object) {
    super(value)
  }
}

class FakeValueString extends ValueObject<string> {
  constructor(value: string) {
    super(value)
  }
}

describe('ValueObject', () => {
  const createStringVO = (value: string = 'some-string') =>
    new FakeValueString(value)
  const createObjectVO = (value: object = { foo: 'bar' }) =>
    new FakeValueObject(value)

  const testImmutability = <T>(
    create: () => ValueObject<T>,
    mutate: (vo: ValueObject<T>) => void,
    originalValue: any,
    property?: string,
  ) => {
    const sut = create()

    try {
      mutate(sut)
    } catch (err) {}

    if (property) {
      if (property.includes('.')) {
        const parts = property.split('.')
        let value: any = sut.value
        for (const part of parts) {
          value = value[part]
        }
        expect(value).toBe(originalValue)
      } else {
        expect((sut.value as any)[property]).toBe(originalValue)
      }
    } else {
      expect(sut.value).toBe(originalValue)
    }
  }

  describe('Creation', () => {
    it('should create a ValueObject with the given value', () => {
      const inputValue = 'some-string'
      const sut = createStringVO(inputValue)
      expect(sut.value).toBe(inputValue)
    })

    it('should store string values as effectively immutable', () => {
      testImmutability(
        () => createStringVO('some-string'),
        (vo) => {
          ;(vo.value as any) = 'edited'
        },
        'some-string',
      )
    })

    it('should store object values as effectively immutable', () => {
      testImmutability(
        () => createObjectVO({ foo: 'bar' }),
        (vo) => {
          ;(vo.value as any).foo = 'edited'
        },
        'bar',
        'foo',
      )
    })

    it('should store nested object values as effectively immutable', () => {
      testImmutability(
        () => createObjectVO({ foo: { bar: 'baz' } }),
        (vo) => {
          ;(vo.value as any).foo.bar = 'edited'
        },
        'baz',
        'foo.bar',
      )
    })
  })

  describe('equals()', () => {
    const testEquality = <T>(
      first: ValueObject<T>,
      second: ValueObject<T> | null | undefined,
      expectedResult: boolean,
    ) => {
      expect(first.equals(second as any)).toBe(expectedResult)
    }

    it('should return true if called with the same instance', () => {
      const sut = createStringVO('test')
      testEquality(sut, sut, true)
    })

    it('should return true if both instances have the same value', () => {
      const sut = createObjectVO({ foo: 'bar' })
      const other = createObjectVO({ foo: 'bar' })
      testEquality(sut, other, true)
    })

    it('should return false if different values', () => {
      const sut = createStringVO('abc')
      const other = createStringVO('xyz')
      testEquality(sut, other, false)
    })

    it('should return false if other is null or undefined', () => {
      const sut = createStringVO('abc')
      testEquality(sut, null, false)
      testEquality(sut, undefined, false)
    })
  })
})
