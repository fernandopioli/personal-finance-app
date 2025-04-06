import {
  RequiredFieldError,
  MinNumberError,
  MaxNumberError,
  MinLengthError,
  MaxLengthError,
  ArrayNotEmptyError,
} from '@domain/errors'

describe('Domain Errors', () => {
  const assertError = <T extends Error>(
    error: T,
    expectedClass: new (...args: any[]) => T,
    expectedName: string,
    expectedField: string,
    expectedMessage: string,
  ) => {
    expect(error).toBeInstanceOf(expectedClass)
    expect(error.name).toBe(expectedName)
    expect((error as any).field).toBe(expectedField)
    expect(error.message).toBe(expectedMessage)
  }

  it('RequiredFieldError should have correct name, field, and message', () => {
    const error = new RequiredFieldError('email')
    assertError(
      error,
      RequiredFieldError,
      'RequiredFieldError',
      'email',
      'The field "email" is required.',
    )
  })

  it('MinNumberError should have correct name, field, and message', () => {
    const error = new MinNumberError('age', 18, 16)
    assertError(
      error,
      MinNumberError,
      'MinNumberError',
      'age',
      'The field "age" must be >= 18. Current value: 16',
    )
  })

  it('MaxNumberError should have correct name, field, and message', () => {
    const error = new MaxNumberError('price', 100, 150)
    assertError(
      error,
      MaxNumberError,
      'MaxNumberError',
      'price',
      'The field "price" must be <= 100. Current value: 150',
    )
  })

  it('MinLengthError should have correct name, field, and message', () => {
    const error = new MinLengthError('username', 3, 1)
    assertError(
      error,
      MinLengthError,
      'MinLengthError',
      'username',
      'The field "username" must be at least 3 characters. Current length: 1',
    )
  })

  it('MaxLengthError should have correct name, field, and message', () => {
    const error = new MaxLengthError('password', 8, 12)
    assertError(
      error,
      MaxLengthError,
      'MaxLengthError',
      'password',
      'The field "password" must be at most 8 characters. Current length: 12',
    )
  })

  it('ArrayNotEmptyError should have correct name, field, and message', () => {
    const error = new ArrayNotEmptyError('tags')
    assertError(
      error,
      ArrayNotEmptyError,
      'ArrayNotEmptyError',
      'tags',
      'The field "tags" must have at least one item in the List.',
    )
  })
})
