import { ValidationError } from '@domain/errors'

export class NegativeNumberError extends ValidationError {
  constructor(field: string, value: number) {
    super(
      field,
      `The field "${field}" must be greater than or equal to 0. Current: ${value}`,
    )
  }
}
