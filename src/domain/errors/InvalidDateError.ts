import { ValidationError } from '@domain/errors'

export class InvalidDateError extends ValidationError {
  constructor(field: string, value: any) {
    super(
      field,
      `The field "${field}" must be a valid date. Received: ${value}`,
    )
  }
}
