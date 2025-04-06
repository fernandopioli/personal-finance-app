import { ValidationError } from '@domain/errors'

export class MinNumberError extends ValidationError {
  constructor(field: string, min: number, actual: number) {
    super(
      field,
      `The field "${field}" must be >= ${min}. Current value: ${actual}`,
    )
  }
}
