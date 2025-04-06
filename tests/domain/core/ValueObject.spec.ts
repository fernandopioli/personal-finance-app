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

describe('Scenario 1: Creation', () => {
  it('should create a ValueObject with the given value', () => {
    const inputValue = 'some-string'

    const sut = new FakeValueString(inputValue)

    expect(sut.value).toBe(inputValue)
  })

  it('should store the value as effectively immutable and freezed as string', () => {
    const inputValue = 'some-string'
    const sut = new FakeValueString(inputValue)

    try {
      ;(sut.value as any) = 'edited'
    } catch (err) {}

    expect(sut.value).toBe('some-string')
  })

  it('should store the value as effectively immutable and freezed as Object', () => {
    const inputValue = { foo: 'bar' }
    const sut = new FakeValueObject(inputValue)

    try {
      ;(sut.value as any).foo = 'edited'
    } catch (err) {}

    expect((sut.value as any).foo).toBe('bar')
  })
  it('should store the value as effectively immutable and freezed as nested Object', () => {
    const inputValue = { foo: { bar: 'baz' } }
    const sut = new FakeValueObject(inputValue)

    try {
      ;(sut.value as any).foo.bar = 'edited'
    } catch (err) {}

    expect((sut.value as any).foo.bar).toBe('baz')
  })
})

describe('equals()', () => {
  it('should return true if called with the same instance', () => {
    const sut = new FakeValueString('test')

    const result = sut.equals(sut)

    expect(result).toBe(true)
  })

  it('should return true if both instances have the same value', () => {
    const value = { foo: 'bar' }
    const sut = new FakeValueObject(value)
    const other = new FakeValueObject({ foo: 'bar' })

    const result = sut.equals(other)

    expect(result).toBe(true)
  })

  it('should return false if different values', () => {
    const sut = new FakeValueString('abc')
    const other = new FakeValueString('xyz')

    const result = sut.equals(other)

    expect(result).toBe(false)
  })

  it('should return false if other is null or undefined', () => {
    const sut = new FakeValueString('abc')

    const resultNull = sut.equals(null as any)
    const resultUndef = sut.equals(undefined)

    expect(resultNull).toBe(false)
    expect(resultUndef).toBe(false)
  })
})
