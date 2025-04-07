import {
  ArrayNotEmptyError,
  InvalidUuidError,
  MaxLengthError,
  MaxNumberError,
  MinLengthError,
  MinNumberError,
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
    return value === null || value === undefined || value === ''
  }

  public isValidUuid(): this {
    if (typeof this.value === 'string' && !UniqueId.isValid(this.value)) {
      this.errors.push(new InvalidUuidError(this.fieldName, this.value))
    }
    return this
  }
}
