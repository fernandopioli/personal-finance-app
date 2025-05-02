import { ValueObject } from '@domain/core'
import { domainAssert } from '@tests/framework'

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
  describe('Creation', () => {
    it('should create a ValueObject with the given value', () => {
      const inputValue = 'some-string'
      const valueObject = new FakeValueString(inputValue)

      domainAssert.assertEqual(valueObject.value, inputValue)
    })

    it('should store string values as effectively immutable', () => {
      const originalValue = 'some-string'
      const valueObject = new FakeValueString(originalValue)

      try {
        ;(valueObject.value as any) = 'edited'
      } catch (err) {}

      domainAssert.assertEqual(valueObject.value, originalValue)
    })

    it('should store object values as effectively immutable', () => {
      const originalObj = { foo: 'bar' }
      const valueObject = new FakeValueObject(originalObj)

      try {
        ;(valueObject.value as any).foo = 'edited'
      } catch (err) {}

      domainAssert.assertEqual((valueObject.value as any).foo, 'bar')
    })

    it('should store nested object values as effectively immutable', () => {
      const originalObj = { foo: { bar: 'baz' } }
      const valueObject = new FakeValueObject(originalObj)

      try {
        ;(valueObject.value as any).foo.bar = 'edited'
      } catch (err) {}

      domainAssert.assertEqual((valueObject.value as any).foo.bar, 'baz')
    })
  })

  describe('equals()', () => {
    it('should return true if called with the same instance', () => {
      const valueObject = new FakeValueString('test')

      domainAssert.assertTrue(valueObject.equals(valueObject))
    })

    it('should return true if both instances have the same value', () => {
      const vo1 = new FakeValueObject({ foo: 'bar' })
      const vo2 = new FakeValueObject({ foo: 'bar' })

      domainAssert.assertTrue(vo1.equals(vo2))
    })

    it('should return false if different values', () => {
      const vo1 = new FakeValueString('abc')
      const vo2 = new FakeValueString('xyz')

      domainAssert.assertFalse(vo1.equals(vo2))
    })

    it('should return false if other is null or undefined', () => {
      const valueObject = new FakeValueString('abc')

      domainAssert.assertFalse(valueObject.equals(null as any))
      domainAssert.assertFalse(valueObject.equals(undefined as any))
    })

    it('should correctly compare value objects using JSON.stringify', () => {
      const vo1 = new FakeValueObject({ foo: 'bar', baz: 123 })
      const vo2 = new FakeValueObject({ foo: 'bar', baz: 123 })
      const vo3 = new FakeValueObject({ foo: 'different', baz: 456 })

      domainAssert.assertEqual(
        JSON.stringify(vo1.value),
        JSON.stringify(vo2.value),
        'Value objects com os mesmos valores devem ser iguais via JSON.stringify',
      )

      domainAssert.assertTrue(vo1.equals(vo2))
      domainAssert.assertFalse(vo1.equals(vo3))
    })
  })
})
