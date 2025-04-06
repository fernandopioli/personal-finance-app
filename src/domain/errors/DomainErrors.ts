import { ValidationError } from '@domain/errors'

export class RequiredFieldError extends ValidationError {
  constructor(field: string) {
    super(field, `The field "${field}" is required.`)
  }
}

export class MinNumberError extends ValidationError {
  constructor(field: string, min: number, actual: number) {
    super(
      field,
      `The field "${field}" must be >= ${min}. Current value: ${actual}`,
    )
  }
}

export class MaxNumberError extends ValidationError {
  constructor(field: string, max: number, actual: number) {
    super(
      field,
      `The field "${field}" must be <= ${max}. Current value: ${actual}`,
    )
  }
}

export class MinLengthError extends ValidationError {
  constructor(field: string, min: number, actualLen: number) {
    super(
      field,
      `The field "${field}" must be at least ${min} characters. Current length: ${actualLen}`,
    )
  }
}

export class MaxLengthError extends ValidationError {
  constructor(field: string, max: number, actualLen: number) {
    super(
      field,
      `The field "${field}" must be at most ${max} characters. Current length: ${actualLen}`,
    )
  }
}

export class ArrayNotEmptyError extends ValidationError {
  constructor(field: string) {
    super(
      field,
      `The field "${field}" must have at least one item in the List.`,
    )
  }
}
