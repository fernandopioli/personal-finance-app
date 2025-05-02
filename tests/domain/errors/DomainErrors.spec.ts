import {
  ArrayNotEmptyError,
  IncompatibleCurrencyError,
  InvalidCurrencyError,
  InvalidDateError,
  InvalidDateRangeError,
  InvalidMoneyValueError,
  InvalidUuidError,
  MaxLengthError,
  MaxNumberError,
  MinLengthError,
  MinNumberError,
  NegativeNumberError,
  NumberRangeError,
  RequiredFieldError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

describe('Domain Errors', () => {
  it('ArrayNotEmptyError should have correct name, field, and message', () => {
    const error = new ArrayNotEmptyError('tags')
    domainAssert.assertDomainError(
      error,
      ArrayNotEmptyError,
      'ArrayNotEmptyError',
      'tags',
      'The field "tags" must have at least one item in the List.',
    )
  })

  it('IncompatibleCurrencyError should have correct name, field, and message for addition', () => {
    const error = IncompatibleCurrencyError.forAddition('USD', 'BRL')
    domainAssert.assertDomainError(
      error,
      IncompatibleCurrencyError,
      'IncompatibleCurrencyError',
      'currency',
      'Cannot add money with different currencies: USD and BRL. Currencies must match.',
    )
  })

  it('IncompatibleCurrencyError should have correct name, field, and message for subtraction', () => {
    const error = IncompatibleCurrencyError.forSubtraction('EUR', 'BRL')
    domainAssert.assertDomainError(
      error,
      IncompatibleCurrencyError,
      'IncompatibleCurrencyError',
      'currency',
      'Cannot subtract money with different currencies: EUR and BRL. Currencies must match.',
    )
  })

  it('InvalidCurrencyError should have correct name, field, and message', () => {
    const error = new InvalidCurrencyError('currency', 123)
    domainAssert.assertDomainError(
      error,
      InvalidCurrencyError,
      'InvalidCurrencyError',
      'currency',
      'The field "currency" must be a valid currency value. Current: 123',
    )
  })

  it('InvalidDateError should have correct name, field, and message', () => {
    const error = new InvalidDateError('birthdate', 'not-a-date')
    domainAssert.assertDomainError(
      error,
      InvalidDateError,
      'InvalidDateError',
      'birthdate',
      'The field "birthdate" must be a valid date. Received: not-a-date',
    )
  })

  it('InvalidDateRangeError should have correct name, field, and message', () => {
    const error = new InvalidDateRangeError('endDate', 'startDate')
    domainAssert.assertDomainError(
      error,
      InvalidDateRangeError,
      'InvalidDateRangeError',
      'endDate',
      'The field "endDate" must be after startDate',
    )
  })

  it('InvalidMoneyValueError should have correct name, field, and message for amount', () => {
    const error = new InvalidMoneyValueError('amount', '123.456')
    domainAssert.assertDomainError(
      error,
      InvalidMoneyValueError,
      'InvalidMoneyValueError',
      'amount',
      'The field "amount" must be a valid monetary value with up to 2 decimal places. Received: 123.456',
    )
  })

  it('InvalidMoneyValueError should have correct name, field, and message for currency', () => {
    const error = new InvalidMoneyValueError('currency', 'us')
    domainAssert.assertDomainError(
      error,
      InvalidMoneyValueError,
      'InvalidMoneyValueError',
      'currency',
      'The field "currency" must be a valid ISO 4217 currency code (3 uppercase letters). Received: us',
    )
  })

  it('InvalidUuidError should have correct name, field, and message', () => {
    const error = new InvalidUuidError('userId', 'not-a-uuid')
    domainAssert.assertDomainError(
      error,
      InvalidUuidError,
      'InvalidUuidError',
      'userId',
      'The field "userId" must be a valid UUID. Current: not-a-uuid',
    )
  })

  it('MaxLengthError should have correct name, field, and message', () => {
    const error = new MaxLengthError('password', 8, 12)
    domainAssert.assertDomainError(
      error,
      MaxLengthError,
      'MaxLengthError',
      'password',
      'The field "password" must be at most 8 characters. Current length: 12',
    )
  })

  it('MaxNumberError should have correct name, field, and message', () => {
    const error = new MaxNumberError('price', 100, 150)
    domainAssert.assertDomainError(
      error,
      MaxNumberError,
      'MaxNumberError',
      'price',
      'The field "price" must be <= 100. Current value: 150',
    )
  })

  it('MinLengthError should have correct name, field, and message', () => {
    const error = new MinLengthError('username', 3, 1)
    domainAssert.assertDomainError(
      error,
      MinLengthError,
      'MinLengthError',
      'username',
      'The field "username" must be at least 3 characters. Current length: 1',
    )
  })

  it('MinNumberError should have correct name, field, and message', () => {
    const error = new MinNumberError('age', 18, 16)
    domainAssert.assertDomainError(
      error,
      MinNumberError,
      'MinNumberError',
      'age',
      'The field "age" must be >= 18. Current value: 16',
    )
  })

  it('NegativeNumberError should have correct name, field, and message', () => {
    const error = new NegativeNumberError('balance', -50)
    domainAssert.assertDomainError(
      error,
      NegativeNumberError,
      'NegativeNumberError',
      'balance',
      'The field "balance" must be greater than or equal to 0. Current: -50',
    )
  })

  it('NumberRangeError should have correct name, field, and message', () => {
    const error = new NumberRangeError('rating', 1, 5, 7)
    domainAssert.assertDomainError(
      error,
      NumberRangeError,
      'NumberRangeError',
      'rating',
      'The field "rating" must be between 1 and 5. Current: 7',
    )
  })

  it('RequiredFieldError should have correct name, field, and message', () => {
    const error = new RequiredFieldError('email')
    domainAssert.assertDomainError(
      error,
      RequiredFieldError,
      'RequiredFieldError',
      'email',
      'The field "email" is required.',
    )
  })
})
