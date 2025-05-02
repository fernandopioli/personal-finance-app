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
  ValidationError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

describe('Validator + FieldValidator', () => {
  describe('required validation', () => {
    it('should add RequiredFieldError if value is null/undefined/empty string', () => {
      const validator = new Validator()

      validator.check('email', '').required()
      validator.check('document', ' ').required()
      validator.check('name', null).required()
      validator.check('address', undefined).required()

      domainAssert.expectAllValidationErrors(validator, [
        { type: RequiredFieldError, field: 'email' },
        { type: RequiredFieldError, field: 'document' },
        { type: RequiredFieldError, field: 'name' },
        { type: RequiredFieldError, field: 'address' },
      ])
    })

    it('should NOT add RequiredFieldError if value is present', () => {
      const validator = new Validator()

      validator.check('email', 'test@example.com').required()
      validator.check('name', 'John Doe').required()
      validator.check('count', 0).required()
      validator.check('active', false).required()

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('number validations', () => {
    it('should add MinNumberError if number is smaller than min', () => {
      const validator = new Validator()

      validator.check('age', -1).minNumber(0)

      const errors = domainAssert.expectValidationErrorCount(validator, 1)
      domainAssert.expectValidationErrorOfType(
        errors,
        MinNumberError,
        'age',
        'must be >= 0',
      )
    })

    it('should NOT add MinNumberError if number is equal to or greater than min', () => {
      const validator = new Validator()

      validator.check('exactMin', 5).minNumber(5)
      validator.check('aboveMin', 10).minNumber(5)

      domainAssert.expectNoValidationErrors(validator)
    })

    it('should add MaxNumberError if number is bigger than max', () => {
      const validator = new Validator()

      validator.check('price', 150).maxNumber(100)

      const errors = domainAssert.expectValidationErrorCount(validator, 1)
      domainAssert.expectValidationErrorOfType(errors, MaxNumberError, 'price')
    })

    it('should NOT add MaxNumberError if number is equal to or less than max', () => {
      const validator = new Validator()

      validator.check('exactMax', 100).maxNumber(100)
      validator.check('belowMax', 50).maxNumber(100)

      domainAssert.expectNoValidationErrors(validator)
    })

    it('should add NumberRangeError if number is outside range', () => {
      const validator = new Validator()

      validator.check('day', -1).numberInRange(1, 31)
      validator.check('month', 13).numberInRange(1, 12)

      domainAssert.expectAllValidationErrors(validator, [
        {
          type: NumberRangeError,
          field: 'day',
          messageContent: 'must be between 1 and 31',
        },
        {
          type: NumberRangeError,
          field: 'month',
          messageContent: 'must be between 1 and 12',
        },
      ])
    })

    it('should NOT add NumberRangeError if number is within range', () => {
      const validator = new Validator()

      validator.check('day', 15).numberInRange(1, 31)
      validator.check('month', 6).numberInRange(1, 12)
      validator.check('minValue', 1).numberInRange(1, 10)
      validator.check('maxValue', 10).numberInRange(1, 10)

      domainAssert.expectNoValidationErrors(validator)
    })

    it('should add NegativeNumberError if number is negative', () => {
      const validator = new Validator()

      validator.check('amount', -100).isNonNegativeNumber()

      const errors = domainAssert.expectValidationErrorCount(validator, 1)
      domainAssert.expectValidationErrorOfType(
        errors,
        NegativeNumberError,
        'amount',
        'must be greater than or equal to 0',
      )
    })

    it('should NOT add NegativeNumberError if number is zero or positive', () => {
      const validator = new Validator()

      validator.check('amount1', 0).isNonNegativeNumber()
      validator.check('amount2', 100).isNonNegativeNumber()

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('string length validations', () => {
    it('should add MinLengthError if string is too short', () => {
      const validator = new Validator()

      validator.check('username', 'ab').minLength(3)

      const errors = domainAssert.expectValidationErrorCount(validator, 1)
      domainAssert.expectValidationErrorOfType(
        errors,
        MinLengthError,
        'username',
      )
    })

    it('should NOT add MinLengthError if string is long enough', () => {
      const validator = new Validator()

      validator.check('exactMin', 'abc').minLength(3)
      validator.check('aboveMin', 'abcde').minLength(3)

      domainAssert.expectNoValidationErrors(validator)
    })

    it('should add MaxLengthError if string is too long', () => {
      const validator = new Validator()

      validator.check('password', 'abcdefghijk').maxLength(5)

      const errors = domainAssert.expectValidationErrorCount(validator, 1)
      domainAssert.expectValidationErrorOfType(
        errors,
        MaxLengthError,
        'password',
      )
    })

    it('should NOT add MaxLengthError if string is short enough', () => {
      const validator = new Validator()

      validator.check('exactMax', 'abcde').maxLength(5)
      validator.check('belowMax', 'abc').maxLength(5)

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('array validations', () => {
    it('should add ArrayNotEmptyError if array is empty or not an array', () => {
      const validator = new Validator()

      validator.check('tags', []).arrayNotEmpty()
      validator.check('options', 'not-an-array').arrayNotEmpty()

      domainAssert.expectAllValidationErrors(validator, [
        { type: ArrayNotEmptyError, field: 'tags' },
        { type: ArrayNotEmptyError, field: 'options' },
      ])
    })

    it('should NOT add ArrayNotEmptyError if array has items', () => {
      const validator = new Validator()

      validator.check('tags', ['tag1']).arrayNotEmpty()
      validator.check('options', ['opt1', 'opt2']).arrayNotEmpty()

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('UUID validations', () => {
    it('should add InvalidUuidError if string is not a valid UUID', () => {
      const validator = new Validator()

      validator.check('id1', 'not-a-uuid').isValidUuid()
      validator.check('id2', '123-456').isValidUuid()
      validator.check('id3', 123456).isValidUuid()

      domainAssert.expectAllValidationErrors(validator, [
        {
          type: InvalidUuidError,
          field: 'id1',
          messageContent: 'must be a valid UUID',
        },
        { type: InvalidUuidError, field: 'id2' },
        { type: InvalidUuidError, field: 'id3' },
      ])
    })

    it('should NOT add InvalidUuidError if string is a valid UUID', () => {
      const validator = new Validator()

      validator
        .check('id', '123e4567-e89b-42d3-a456-556642440000')
        .isValidUuid()

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('date range validations', () => {
    it('should add InvalidDateRangeError if date is not after reference date', () => {
      const validator = new Validator()
      const startDate = new Date('2023-05-01')

      validator.check('endDate1', new Date('2023-04-30')).isDateAfter(startDate)
      validator.check('endDate2', new Date('2023-05-01')).isDateAfter(startDate)

      domainAssert.expectAllValidationErrors(validator, [
        {
          type: InvalidDateRangeError,
          field: 'endDate1',
          messageContent: 'must be after startDate',
        },
        { type: InvalidDateRangeError, field: 'endDate2' },
      ])
    })

    it('should NOT add InvalidDateRangeError if date is after reference date', () => {
      const validator = new Validator()
      const startDate = new Date('2023-05-01')

      validator.check('endDate', new Date('2023-05-02')).isDateAfter(startDate)

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('date validations', () => {
    it('should add InvalidDateError if value is not a valid date', () => {
      const validator = new Validator()
      const invalidDate = new Date('invalid-date')

      validator.check('birthDate1', 'not-a-date').isValidDate()
      validator.check('birthDate2', 123456).isValidDate()
      validator.check('birthDate3', {}).isValidDate()
      validator.check('birthDate4', invalidDate).isValidDate()

      domainAssert.expectAllValidationErrors(validator, [
        { type: InvalidDateError, field: 'birthDate1' },
        { type: InvalidDateError, field: 'birthDate2' },
        { type: InvalidDateError, field: 'birthDate3' },
        {
          type: InvalidDateError,
          field: 'birthDate4',
          messageContent: 'must be a valid date',
        },
      ])
    })

    it('should NOT add InvalidDateError if Date is valid', () => {
      const validator = new Validator()

      validator.check('birthDate', new Date('2000-01-01')).isValidDate()
      validator.check('currentDate', new Date()).isValidDate()

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('currency validations', () => {
    it('should add InvalidCurrencyError if value is not a valid currency', () => {
      const validator = new Validator()

      validator.check('amount1', 'not-a-currency').isCurrency()
      validator.check('amount2', NaN).isCurrency()
      validator.check('amount3', {}).isCurrency()
      validator.check('amount4', -100).isCurrency()

      domainAssert.expectAllValidationErrors(validator, [
        { type: InvalidCurrencyError, field: 'amount1' },
        { type: InvalidCurrencyError, field: 'amount2' },
        { type: InvalidCurrencyError, field: 'amount3' },
        { type: InvalidCurrencyError, field: 'amount4' },
      ])
    })

    it('should NOT add InvalidCurrencyError if value is a valid currency', () => {
      const validator = new Validator()

      validator.check('amount1', 0).isCurrency()
      validator.check('amount2', 100).isCurrency()
      validator.check('amount3', 99.99).isCurrency()
      validator.check('amount4', 99.9999).isCurrency()

      domainAssert.expectNoValidationErrors(validator)
    })
  })

  describe('combined validations', () => {
    it('should collect multiple errors on different fields', () => {
      const validator = new Validator()

      validator.check('nome', '').required().minLength(3)
      validator.check('idade', -5).minNumber(0)
      validator.check('tags', []).arrayNotEmpty()

      domainAssert.expectAllValidationErrors(validator, [
        { type: RequiredFieldError, field: 'nome' },
        { type: MinNumberError, field: 'idade' },
        { type: ArrayNotEmptyError, field: 'tags' },
      ])
    })

    it('should NOT add error if the checks pass', () => {
      const validator = new Validator()

      validator.check('nome', 'John Doe').required().minLength(3).maxLength(20)
      validator.check('idade', 30).minNumber(0).maxNumber(100)
      validator.check('tags', ['one', 'two']).arrayNotEmpty()

      domainAssert.expectNoValidationErrors(validator)
    })

    it('should add errors directly with addErrors method', () => {
      const validator = new Validator()

      const errorsToAdd: ValidationError[] = [
        new RequiredFieldError('campo1'),
        new MinNumberError('campo2', 10, 5),
      ]

      validator.addErrors(errorsToAdd)

      const errors = domainAssert.expectValidationErrorCount(validator, 2)
      domainAssert.expectValidationErrorOfType(
        errors,
        RequiredFieldError,
        'campo1',
      )
      domainAssert.expectValidationErrorOfType(errors, MinNumberError, 'campo2')
    })

    it('should combine errors added via check and addErrors', () => {
      const validator = new Validator()

      validator.check('email', '').required()

      const additionalErrors: ValidationError[] = [
        new MaxLengthError('name', 50, 60),
      ]

      validator.addErrors(additionalErrors)

      domainAssert.expectAllValidationErrors(validator, [
        { type: RequiredFieldError, field: 'email' },
        { type: MaxLengthError, field: 'name' },
      ])
    })
  })
})
