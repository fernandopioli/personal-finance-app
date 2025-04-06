import {
  ArrayNotEmptyError,
  MaxLengthError,
  MaxNumberError,
  MinLengthError,
  MinNumberError,
  RequiredFieldError,
  ValidationError,
} from '@domain/errors'

export class FieldValidator {
  constructor(
    private readonly fieldName: string,
    private readonly value: any,
    private readonly errors: ValidationError[],
  ) {}

  public required(): this {
    if (this.value === null || this.value === undefined || this.value === '') {
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

  public minLength(min: number): this {
    if (typeof this.value === 'string') {
      const actualLen = this.value.trim().length
      if (actualLen < min) {
        this.errors.push(new MinLengthError(this.fieldName, min, actualLen))
      }
    }
    return this
  }

  public maxLength(max: number): this {
    if (typeof this.value === 'string') {
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
}
