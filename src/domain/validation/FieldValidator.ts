import {
  ArrayNotEmptyError,
  InvalidCurrencyError,
  InvalidDateError,
  InvalidDateRangeError,
  InvalidUuidError,
  MaxLengthError,
  MaxNumberError,
  MinLengthError,
  MinNumberError,
  NegativeNumberError,
  NumberRangeError,
  RequiredFieldError,
  ValidationError,
} from '@domain/errors'
import { UniqueId } from '@domain/core'

export class FieldValidator {
  constructor(
    private readonly fieldName: string,
    private readonly value: any,
    private readonly errors: ValidationError[],
  ) {}

  public required(): this {
    if (this.isEmpty(this.value)) {
      this.errors.push(new RequiredFieldError(this.fieldName))
    }
    return this
  }

  public minNumber(min: number): this {
    if (typeof this.value === 'number') {
      if (this.value < min) {
        this.errors.push(new MinNumberError(this.fieldName, min, this.value))
      }
    }
    return this
  }

  public maxNumber(max: number): this {
    if (typeof this.value === 'number') {
      if (this.value > max) {
        this.errors.push(new MaxNumberError(this.fieldName, max, this.value))
      }
    }
    return this
  }

  public numberInRange(min: number, max: number): this {
    if (typeof this.value === 'number') {
      if (this.value < min || this.value > max) {
        this.errors.push(
          new NumberRangeError(this.fieldName, min, max, this.value),
        )
      }
    }
    return this
  }

  public minLength(min: number): this {
    if (typeof this.value === 'string' && !this.isEmpty(this.value)) {
      const actualLen = this.value.trim().length
      if (actualLen < min) {
        this.errors.push(new MinLengthError(this.fieldName, min, actualLen))
      }
    }
    return this
  }

  public maxLength(max: number): this {
    if (typeof this.value === 'string' && !this.isEmpty(this.value)) {
      const actualLen = this.value.trim().length
      if (actualLen > max) {
        this.errors.push(new MaxLengthError(this.fieldName, max, actualLen))
      }
    }
    return this
  }

  public arrayNotEmpty(): this {
    if (!Array.isArray(this.value) || this.value.length === 0) {
      this.errors.push(new ArrayNotEmptyError(this.fieldName))
    }
    return this
  }

  private isEmpty(value: any): boolean {
    return (
      value === null || value === undefined || value === '' || value === ' '
    )
  }

  public isValidUuid(): this {
    if (this.value) {
      if (!UniqueId.isValid(this.value)) {
        this.errors.push(new InvalidUuidError(this.fieldName, this.value))
      }
    }
    return this
  }

  public isNonNegativeNumber(): this {
    if (typeof this.value === 'number' && this.value < 0) {
      this.errors.push(new NegativeNumberError(this.fieldName, this.value))
    }
    return this
  }

  public isDateAfter(
    date: Date,
    referenceFieldName: string = 'startDate',
  ): this {
    if (this.value instanceof Date && date instanceof Date) {
      if (this.value <= date) {
        this.errors.push(
          new InvalidDateRangeError(this.fieldName, referenceFieldName),
        )
      }
    }
    return this
  }

  public isValidDate(): this {
    if (this.value !== undefined && this.value !== null) {
      if (!(this.value instanceof Date)) {
        this.errors.push(new InvalidDateError(this.fieldName, this.value))
        return this
      }

      const timestamp = this.value.getTime()
      if (isNaN(timestamp)) {
        this.errors.push(new InvalidDateError(this.fieldName, 'Invalid Date'))
      }
    }
    return this
  }

  public isCurrency(): this {
    if (
      (this.value !== undefined && typeof this.value !== 'number') ||
      (typeof this.value === 'number' && isNaN(this.value)) ||
      (typeof this.value === 'number' && this.value < 0)
    ) {
      this.errors.push(new InvalidCurrencyError(this.fieldName, this.value))
    }
    return this
  }
}
