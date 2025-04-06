import { Validator } from '@domain/validation'
import {
  RequiredFieldError,
  MinNumberError,
  MaxNumberError,
  MinLengthError,
  MaxLengthError,
  ArrayNotEmptyError,
} from '@domain/errors'

describe('Validator + FieldValidator', () => {
  it('should add RequiredFieldError if value is null/undefined/empty string', () => {
    const validator = new Validator()

    validator.check('email', '').required()
    validator.check('name', null).required()
    validator.check('address', undefined).required()

    const errors = validator.getErrors()
    expect(errors).toHaveLength(3)

    expect(errors[0]).toBeInstanceOf(RequiredFieldError)
    expect(errors[0].field).toBe('email')
    expect(errors[1]).toBeInstanceOf(RequiredFieldError)
    expect(errors[1].field).toBe('name')
    expect(errors[2]).toBeInstanceOf(RequiredFieldError)
    expect(errors[2].field).toBe('address')
  })

  it('should add MinNumberError if number is smaller than min', () => {
    const validator = new Validator()

    validator.check('age', -1).minNumber(0)

    const errors = validator.getErrors()
    expect(errors).toHaveLength(1)

    const [error] = errors
    expect(error).toBeInstanceOf(MinNumberError)
    expect(error.field).toBe('age')
    expect(error.message).toContain('must be >= 0')
  })

  it('should add MaxNumberError if number is bigger than max', () => {
    const validator = new Validator()

    validator.check('price', 150).maxNumber(100)

    const errors = validator.getErrors()
    expect(errors).toHaveLength(1)

    const [error] = errors
    expect(error).toBeInstanceOf(MaxNumberError)
    expect(error.field).toBe('price')
  })

  it('should add MinLengthError if string is too short', () => {
    const validator = new Validator()

    validator.check('username', 'ab').minLength(3)

    const errors = validator.getErrors()
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBeInstanceOf(MinLengthError)
    expect(errors[0].field).toBe('username')
  })

  it('should add MaxLengthError if string is too long', () => {
    const validator = new Validator()

    validator.check('password', 'abcdefghijk').maxLength(5)

    const errors = validator.getErrors()
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBeInstanceOf(MaxLengthError)
    expect(errors[0].field).toBe('password')
  })

  it('should add ArrayNotEmptyError if array is empty or not an array', () => {
    const validator = new Validator()

    validator.check('tags', []).arrayNotEmpty()
    validator.check('options', 'not-an-array').arrayNotEmpty()

    const errors = validator.getErrors()
    expect(errors).toHaveLength(2)

    expect(errors[0]).toBeInstanceOf(ArrayNotEmptyError)
    expect(errors[0].field).toBe('tags')

    expect(errors[1]).toBeInstanceOf(ArrayNotEmptyError)
    expect(errors[1].field).toBe('options')
  })

  it('should collect multiple errors on different fields', () => {
    const validator = new Validator()

    validator.check('nome', '').required().minLength(3)
    validator.check('idade', -5).minNumber(0)
    validator.check('tags', []).arrayNotEmpty()

    const errors = validator.getErrors()

    expect(errors).toHaveLength(3)

    const requiredError = errors.find(
      (e) => e instanceof RequiredFieldError && e.field === 'nome',
    )
    const minNumError = errors.find(
      (e) => e instanceof MinNumberError && e.field === 'idade',
    )
    const arrNotEmptyError = errors.find(
      (e) => e instanceof ArrayNotEmptyError && e.field === 'tags',
    )

    expect(requiredError).toBeDefined()
    expect(minNumError).toBeDefined()
    expect(arrNotEmptyError).toBeDefined()
  })

  it('should NOT add error if the checks pass', () => {
    const validator = new Validator()

    validator.check('nome', 'John Doe').required().minLength(3).maxLength(20)

    validator.check('idade', 30).minNumber(0).maxNumber(100)

    validator.check('tags', ['one', 'two']).arrayNotEmpty()

    expect(validator.hasErrors()).toBe(false)
    expect(validator.getErrors()).toHaveLength(0)
  })
})
