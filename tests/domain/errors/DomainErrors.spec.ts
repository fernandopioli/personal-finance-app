import {
  RequiredFieldError,
  MinNumberError,
  MaxNumberError,
  MinLengthError,
  MaxLengthError,
  ArrayNotEmptyError,
} from '@domain/errors'

describe('Domain Errors', () => {
  it('RequiredFieldError should have correct name, field, and message', () => {
    const error = new RequiredFieldError('email')

    expect(error).toBeInstanceOf(RequiredFieldError)
    expect(error.name).toBe('RequiredFieldError')
    expect(error.field).toBe('email')
    expect(error.message).toBe('The field "email" is required.')
  })

  it('MinNumberError should have correct name, field, and message', () => {
    const error = new MinNumberError('age', 18, 16)

    expect(error).toBeInstanceOf(MinNumberError)
    expect(error.name).toBe('MinNumberError')
    expect(error.field).toBe('age')
    expect(error.message).toBe(
      'The field "age" must be >= 18. Current value: 16',
    )
  })

  it('MaxNumberError should have correct name, field, and message', () => {
    const error = new MaxNumberError('price', 100, 150)

    expect(error).toBeInstanceOf(MaxNumberError)
    expect(error.name).toBe('MaxNumberError')
    expect(error.field).toBe('price')
    expect(error.message).toBe(
      'The field "price" must be <= 100. Current value: 150',
    )
  })

  it('MinLengthError should have correct name, field, and message', () => {
    const error = new MinLengthError('username', 3, 1)

    expect(error).toBeInstanceOf(MinLengthError)
    expect(error.name).toBe('MinLengthError')
    expect(error.field).toBe('username')
    expect(error.message).toBe(
      'The field "username" must be at least 3 characters. Current length: 1',
    )
  })

  it('MaxLengthError should have correct name, field, and message', () => {
    const error = new MaxLengthError('password', 8, 12)

    expect(error).toBeInstanceOf(MaxLengthError)
    expect(error.name).toBe('MaxLengthError')
    expect(error.field).toBe('password')
    expect(error.message).toBe(
      'The field "password" must be at most 8 characters. Current length: 12',
    )
  })

  it('ArrayNotEmptyError should have correct name, field, and message', () => {
    const error = new ArrayNotEmptyError('tags')

    expect(error).toBeInstanceOf(ArrayNotEmptyError)
    expect(error.name).toBe('ArrayNotEmptyError')
    expect(error.field).toBe('tags')
    expect(error.message).toBe(
      'The field "tags" must have at least one item in the List.',
    )
  })
})
