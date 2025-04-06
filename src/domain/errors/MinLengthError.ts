import { ValidationError } from '@domain/errors'

export class MinLengthError extends ValidationError {
  constructor(field: string, min: number, actualLen: number) {
    super(
      field,
      `The field "${field}" must be at least ${min} characters. Current length: ${actualLen}`,
    )
  }
}
