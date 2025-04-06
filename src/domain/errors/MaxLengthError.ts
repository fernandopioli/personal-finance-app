import { ValidationError } from '@domain/errors'

export class MaxLengthError extends ValidationError {
  constructor(field: string, max: number, actualLen: number) {
    super(
      field,
      `The field "${field}" must be at most ${max} characters. Current length: ${actualLen}`,
    )
  }
}
