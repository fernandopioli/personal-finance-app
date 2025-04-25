import { Validator } from '@domain/validation'
import {
  RequiredFieldError,
  MinNumberError,
  MaxNumberError,
  MinLengthError,
  MaxLengthError,
  ArrayNotEmptyError,
  NegativeNumberError,
  InvalidDateRangeError,
  InvalidUuidError,
  InvalidDateError,
  NumberRangeError,
  InvalidCurrencyError,
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

  it('should add NumberRangeError if number is outside range', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('day', -1).numberInRange(1, 31)
        validator.check('month', 13).numberInRange(1, 12)
      },
      2,
      (errors) => {
        assertError(errors[0], NumberRangeError, 'day')
        assertError(errors[1], NumberRangeError, 'month')
        expect(errors[0].message).toContain('must be between 1 and 31')
        expect(errors[1].message).toContain('must be between 1 and 12')
      },
    )
  })

  it('should NOT add NumberRangeError if number is within range', () => {
    createValidatorAndCheck((validator) => {
      validator.check('day', 15).numberInRange(1, 31)
      validator.check('month', 6).numberInRange(1, 12)
      // Min/max inclusive
      validator.check('minValue', 1).numberInRange(1, 10)
      validator.check('maxValue', 10).numberInRange(1, 10)
    }, 0)
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

  it('should add InvalidUuidError if string is not a valid UUID', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('id1', 'not-a-uuid').isValidUuid()
        validator.check('id2', '123-456').isValidUuid()
        validator.check('id3', 123456).isValidUuid()
      },
      3,
      (errors) => {
        assertError(errors[0], InvalidUuidError, 'id1')
        assertError(errors[1], InvalidUuidError, 'id2')
        assertError(errors[2], InvalidUuidError, 'id3')
        expect(errors[0].message).toContain('must be a valid UUID')
      },
    )
  })

  it('should NOT add InvalidUuidError if string is a valid UUID', () => {
    createValidatorAndCheck((validator) => {
      validator
        .check('id', '123e4567-e89b-42d3-a456-556642440000')
        .isValidUuid()
    }, 0)
  })

  it('should add NegativeNumberError if number is negative', () => {
    createValidatorAndCheck(
      (validator) => validator.check('amount', -100).isNonNegativeNumber(),
      1,
      (errors) => {
        assertError(errors[0], NegativeNumberError, 'amount')
        expect(errors[0].message).toContain(
          'must be greater than or equal to 0',
        )
      },
    )
  })

  it('should NOT add NegativeNumberError if number is zero or positive', () => {
    createValidatorAndCheck((validator) => {
      validator.check('amount1', 0).isNonNegativeNumber()
      validator.check('amount2', 100).isNonNegativeNumber()
    }, 0)
  })

  it('should add InvalidDateRangeError if date is not after reference date', () => {
    const startDate = new Date('2023-05-01')

    createValidatorAndCheck(
      (validator) => {
        // Data anterior à referência
        validator
          .check('endDate1', new Date('2023-04-30'))
          .isDateAfter(startDate)
        // Data igual à referência
        validator
          .check('endDate2', new Date('2023-05-01'))
          .isDateAfter(startDate)
      },
      2,
      (errors) => {
        assertError(errors[0], InvalidDateRangeError, 'endDate1')
        assertError(errors[1], InvalidDateRangeError, 'endDate2')
        expect(errors[0].message).toContain('must be after startDate')
      },
    )
  })

  it('should NOT add InvalidDateRangeError if date is after reference date', () => {
    const startDate = new Date('2023-05-01')

    createValidatorAndCheck((validator) => {
      validator.check('endDate', new Date('2023-05-02')).isDateAfter(startDate)
    }, 0)
  })

  it('should add InvalidDateError if value is not a Date object', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('birthDate1', 'not-a-date').isValidDate()
        validator.check('birthDate2', 123456).isValidDate()
        validator.check('birthDate3', {}).isValidDate()
      },
      3,
      (errors) => {
        assertError(errors[0], InvalidDateError, 'birthDate1')
        assertError(errors[1], InvalidDateError, 'birthDate2')
        assertError(errors[2], InvalidDateError, 'birthDate3')
      },
    )
  })

  it('should add InvalidDateError if Date is invalid (NaN)', () => {
    const invalidDate = new Date('invalid-date')

    createValidatorAndCheck(
      (validator) => {
        validator.check('birthDate', invalidDate).isValidDate()
      },
      1,
      (errors) => {
        assertError(errors[0], InvalidDateError, 'birthDate')
        expect(errors[0].message).toContain('must be a valid date')
      },
    )
  })

  it('should NOT add InvalidDateError if Date is valid', () => {
    createValidatorAndCheck((validator) => {
      validator.check('birthDate', new Date('2000-01-01')).isValidDate()
    }, 0)
  })

  it('should add InvalidCurrencyError if value is not a valid currency', () => {
    createValidatorAndCheck(
      (validator) => {
        validator.check('amount', 'not-a-currency').isCurrency()
      },
      1,
      (errors) => {
        assertError(errors[0], InvalidCurrencyError, 'amount')
      },
    )
  })

  it('should add InvalidCurrencyError if value is negative', () => {
    createValidatorAndCheck(
      (validator) => validator.check('amount', -100).isCurrency(),
      1,
      (errors) => assertError(errors[0], InvalidCurrencyError, 'amount'),
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
