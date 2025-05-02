import { Result, UniqueId, Money, Entity } from '@domain/core'
import { ValidationError } from '@domain/errors'
import { Validator } from '@domain/validation'
import { TestAdapter } from '@tests/framework/TestAdapter'

export class DomainAssertions {
  constructor(private readonly adapter: TestAdapter) {}

  // UTILS
  assertTrue(value: boolean, message?: string): void {
    this.adapter.assertTrue(value, message)
  }

  assertFalse(value: boolean, message?: string): void {
    this.adapter.assertFalse(value, message)
  }

  assertEqual(actual: any, expected: any, message?: string): void {
    this.adapter.assertEqual(actual, expected, message)
  }

  assertNotEqual(actual: any, expected: any, message?: string): void {
    this.adapter.assertNotEqual(actual, expected, message)
  }

  assertLength<T>(collection: T[], length: number, message?: string): void {
    this.adapter.assertLength(collection, length, message)
  }

  expectThrows(fn: () => any, message?: string): void {
    try {
      fn()
      this.adapter.assertTrue(
        false,
        'Expected function to throw but it did not',
      )
    } catch (error) {
      if (message) {
        this.adapter.assertEqual((error as Error).message, message)
      }
    }
  }

  // OTHERS UTILS

  // TO DO: USAR UUID LIB
  expectValidUniqueId(id: UniqueId): void {
    this.adapter.assertDefined(id)
    this.adapter.assertTrue(
      typeof id.value === 'string',
      'Expected ID to be convertible to string',
    )
    this.adapter.assertMatch(
      id.value,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      'Expected ID to be a valid UUID',
    )
  }

  expectUniqueIdEquals(actual: UniqueId, expected: string | UniqueId): void {
    const expectedValue =
      typeof expected === 'string' ? expected : expected.value
    this.adapter.assertEqual(actual.value, expectedValue)
  }

  // RESULTS

  expectResultSuccess<T>(result: Result<T>): T {
    this.adapter.assertTrue(
      result.isSuccess,
      `Expected success but got failure with errors: ${JSON.stringify(result.errors)}`,
    )
    this.adapter.assertFalse(
      result.isFailure,
      'Expected isFailure to be false for success result',
    )
    this.adapter.assertLength(
      result.errors,
      0,
      'Expected errors to be empty for success result',
    )
    return result.value
  }

  expectFailure(result: Result<any>): void {
    this.adapter.assertTrue(
      result.isFailure,
      'Expected failure but got success',
    )
  }

  expectResultFailure<T>(result: Result<T>, expectedErrors?: Error[]): Error[] {
    this.adapter.assertFalse(
      result.isSuccess,
      'Expected isSuccess to be false for failure result',
    )
    this.expectFailure(result)

    if (expectedErrors) {
      this.adapter.assertLength(result.errors, expectedErrors.length)
      expectedErrors.forEach((expectedError, index) => {
        this.adapter.assertEqual(
          result.errors[index].message,
          expectedError.message,
        )
      })
    }

    return result.errors
  }

  expectFailureWithMessage(
    result: Result<any>,
    messagePart: string,
    minimumErrors: number = 1,
  ): void {
    this.expectFailure(result)
    this.adapter.assertGreaterThan(result.errors.length, minimumErrors - 1)

    const hasMsg = result.errors.some((err: any) =>
      err.message.includes(messagePart),
    )
    this.adapter.assertTrue(
      hasMsg,
      `Expected error message to contain "${messagePart}"`,
    )
  }

  expectFieldErrors(result: Result<any>, expectedFields: string[]): void {
    this.expectFailure(result)

    const errorFields = result.errors.map((e) => (e as ValidationError).field)

    expectedFields.forEach((field) => {
      this.adapter.assertContains(errorFields, field)
    })
  }

  // DOMAIN

  expectValidEntity<
    T extends { id: UniqueId; createdAt: Date; updatedAt: Date },
  >(entity: T, id?: string): void {
    this.adapter.assertDefined(entity)
    this.adapter.assertInstanceOf(
      entity,
      Entity as any,
      'Entity must be an instance of Entity',
    )
    this.expectValidUniqueId(entity.id)
    this.expectValidDates(entity)

    if (id) {
      this.adapter.assertEqual(entity.id.value, id)
    }
  }

  expectValidDates(entity: any): void {
    this.adapter.assertDefined(entity.createdAt)
    this.adapter.assertTrue(
      entity.createdAt instanceof Date,
      'Expected createdAt to be a Date',
    )

    this.adapter.assertDefined(entity.updatedAt)
    this.adapter.assertTrue(
      entity.updatedAt instanceof Date,
      'Expected updatedAt to be a Date',
    )
  }

  assertDomainError<T extends Error>(
    error: T,
    expectedClass: new (...args: any[]) => T,
    expectedName: string,
    expectedField: string,
    expectedMessage: string,
  ): void {
    this.adapter.assertInstanceOf(error, expectedClass)
    this.adapter.assertEqual(error.name, expectedName)
    this.adapter.assertEqual((error as any).field, expectedField)
    this.adapter.assertEqual(error.message, expectedMessage)
  }

  expectValidValueObject<T>(
    valueObject: any,
    expectedValue?: T,
    equalTo?: any,
  ): void {
    this.adapter.assertDefined(valueObject)

    this.adapter.assertTrue(
      'value' in valueObject,
      'ValueObject must have a value property',
    )
    this.adapter.assertTrue(
      'equals' in valueObject,
      'ValueObject must have an equals method',
    )

    if (expectedValue !== undefined) {
      this.adapter.assertEqual(
        valueObject.value,
        expectedValue,
        `Expected ValueObject value to be ${expectedValue} but got ${valueObject.value}`,
      )
    }

    if (equalTo !== undefined) {
      this.adapter.assertDefined(equalTo)
      this.adapter.assertTrue(
        'value' in equalTo,
        'Comparison object must be a ValueObject with value property',
      )
      this.adapter.assertTrue(
        'equals' in equalTo,
        'Comparison object must be a ValueObject with equals method',
      )

      this.adapter.assertTrue(
        valueObject.equals(equalTo),
        `Expected ValueObjects to be equal: ${JSON.stringify(valueObject.value)} and ${JSON.stringify(equalTo.value)}`,
      )
    }
  }

  // NOT USED ##########################################################################
  expectEntityHasProperty<T>(
    entity: T,
    property: string,
    expectedValue?: any,
  ): void {
    this.adapter.assertTrue(
      property in (entity as any),
      `Expected entity to have property "${property}"`,
    )

    if (expectedValue !== undefined) {
      this.adapter.assertEqual(
        (entity as any)[property],
        expectedValue,
        `Expected entity.${property} to be ${expectedValue}`,
      )
    }
  }

  // VALIDATOR

  expectNoValidationErrors(validator: Validator): void {
    this.adapter.assertFalse(
      validator.hasErrors(),
      'Expected validator to have no errors',
    )
    this.adapter.assertLength(
      validator.getErrors(),
      0,
      'Expected validator errors array to be empty',
    )
  }

  expectValidationErrorCount(
    validator: Validator,
    count: number,
  ): ValidationError[] {
    const errors = validator.getErrors()
    this.adapter.assertEqual(
      errors.length,
      count,
      `Expected validator to have ${count} errors, but got ${errors.length}`,
    )
    return errors
  }

  expectValidationErrorOfType<T extends ValidationError>(
    errors: ValidationError[],
    errorClass: new (...args: any[]) => T,
    field: string,
    messageContent?: string,
  ): T {
    const error = errors.find(
      (e) => e instanceof errorClass && e.field === field,
    ) as T

    this.adapter.assertDefined(
      error,
      `Expected to find error of type ${errorClass.name} for field "${field}"`,
    )

    if (messageContent) {
      this.adapter.assertTrue(
        error.message.includes(messageContent),
        `Expected error message to contain "${messageContent}", but got "${error.message}"`,
      )
    }

    return error
  }

  expectAllValidationErrors(
    validator: Validator,
    expectedErrors: Array<{
      type: new (...args: any[]) => ValidationError
      field: string
      messageContent?: string
    }>,
  ): void {
    const errors = this.expectValidationErrorCount(
      validator,
      expectedErrors.length,
    )

    expectedErrors.forEach((expected) => {
      this.expectValidationErrorOfType(
        errors,
        expected.type,
        expected.field,
        expected.messageContent,
      )
    })
  }

  // NOT USED ##########################################################################
  expectNoValidationErrorOfType<T extends ValidationError>(
    validator: Validator,
    errorClass: new (...args: any[]) => T,
    field?: string,
  ): void {
    const errors = validator.getErrors()

    if (field) {
      const hasErrorOfTypeAndField = errors.some(
        (e) => e instanceof errorClass && e.field === field,
      )

      this.adapter.assertFalse(
        hasErrorOfTypeAndField,
        `Expected no error of type ${errorClass.name} for field "${field}", but found one`,
      )
    } else {
      const hasErrorOfType = errors.some((e) => e instanceof errorClass)

      this.adapter.assertFalse(
        hasErrorOfType,
        `Expected no errors of type ${errorClass.name}, but found at least one`,
      )
    }
  }

  // NOT USED ##########################################################################
  expectValidationErrorWithExactMessage(
    errors: ValidationError[],
    errorClass: new (...args: any[]) => ValidationError,
    field: string,
    exactMessage: string,
  ): ValidationError {
    const error = this.expectValidationErrorOfType(errors, errorClass, field)

    this.adapter.assertEqual(
      error.message,
      exactMessage,
      `Expected error message to be "${exactMessage}", but got "${error.message}"`,
    )

    return error
  }

  // MONEY

  expectMoneyEquals(
    actual: Money,
    amount: number,
    currency: string = 'BRL',
  ): void {
    this.adapter.assertDefined(actual)
    this.adapter.assertEqual(actual.amount, amount)
    this.adapter.assertEqual(actual.currency, currency)
  }

  expectMoneysEqual(first: Money, second: Money): void {
    this.adapter.assertEqual(first.amount, second.amount)
    this.adapter.assertEqual(first.currency, second.currency)
  }

  // NOT USED ##########################################################################
  debugResult<T>(result: Result<T>): Result<T> {
    console.log('Debug Result:', {
      isSuccess: result.isSuccess,
      isFailure: result.isFailure,
      value: result.value,
      errors: result.errors,
    })
    return result
  }

  // NOT USED ##########################################################################
  debugEntity(entity: any, label: string = 'Entity'): any {
    console.log(`Debug ${label}:`, JSON.stringify(entity, null, 2))
    return entity
  }
}
