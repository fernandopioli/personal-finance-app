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
  const createValidatorAndCheck = (
    validations: (validator: Validator) => void,
    expectedErrors: number,
    errorChecks?: (errors: Error[]) => void,
  ) => {
    const validator = new Validator()
    validations(validator)

    const errors = validator.getErrors()
    expect(errors).toHaveLength(expectedErrors)

    if (errorChecks) {
      errorChecks(errors)
    }

    return { validator, errors }
  }

  const assertError = (error: Error, errorClass: any, field: string) => {
    expect(error).toBeInstanceOf(errorClass)
    expect((error as any).field).toBe(field)
  }

  it('should add RequiredFieldError if value is null/undefined/empty string', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('email', '').required()
        validator.check('name', null).required()
        validator.check('address', undefined).required()
      },
      3,
      (errors) => {
        assertError(errors[0], RequiredFieldError, 'email')
        assertError(errors[1], RequiredFieldError, 'name')
        assertError(errors[2], RequiredFieldError, 'address')
      },
    )
  })

  it('should add MinNumberError if number is smaller than min', () => {
    createValidatorAndCheck(
      (validator) => validator.check('age', -1).minNumber(0),
      1,
      (errors) => {
        assertError(errors[0], MinNumberError, 'age')
        expect(errors[0].message).toContain('must be >= 0')
      },
    )
  })

  it('should add MaxNumberError if number is bigger than max', () => {
    createValidatorAndCheck(
      (validator) => validator.check('price', 150).maxNumber(100),
      1,
      (errors) => assertError(errors[0], MaxNumberError, 'price'),
    )
  })

  it('should add MinLengthError if string is too short', () => {
    createValidatorAndCheck(
      (validator) => validator.check('username', 'ab').minLength(3),
      1,
      (errors) => assertError(errors[0], MinLengthError, 'username'),
    )
  })

  it('should add MaxLengthError if string is too long', () => {
    createValidatorAndCheck(
      (validator) => validator.check('password', 'abcdefghijk').maxLength(5),
      1,
      (errors) => assertError(errors[0], MaxLengthError, 'password'),
    )
  })

  it('should add ArrayNotEmptyError if array is empty or not an array', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('tags', []).arrayNotEmpty()
        validator.check('options', 'not-an-array').arrayNotEmpty()
      },
      2,
      (errors) => {
        assertError(errors[0], ArrayNotEmptyError, 'tags')
        assertError(errors[1], ArrayNotEmptyError, 'options')
      },
    )
  })

  it('should collect multiple errors on different fields', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('nome', '').required().minLength(3)
        validator.check('idade', -5).minNumber(0)
        validator.check('tags', []).arrayNotEmpty()
      },
      3,
      (errors) => {
        const findError = (errorClass: any, field: string) =>
          errors.find(
            (e) => e instanceof errorClass && (e as any).field === field,
          )

        expect(findError(RequiredFieldError, 'nome')).toBeDefined()
        expect(findError(MinNumberError, 'idade')).toBeDefined()
        expect(findError(ArrayNotEmptyError, 'tags')).toBeDefined()
      },
    )
  })

  it('should NOT add error if the checks pass', () => {
    const { validator } = createValidatorAndCheck((validator) => {
      validator.check('nome', 'John Doe').required().minLength(3).maxLength(20)
      validator.check('idade', 30).minNumber(0).maxNumber(100)
      validator.check('tags', ['one', 'two']).arrayNotEmpty()
    }, 0)

    expect(validator.hasErrors()).toBe(false)
  })
})
