import { ValidationError } from '@domain/errors'

export class MaxNumberError extends ValidationError {
  constructor(field: string, max: number, actual: number) {
    super(
      field,
      `The field "${field}" must be <= ${max}. Current value: ${actual}`,
    )
  }
}
