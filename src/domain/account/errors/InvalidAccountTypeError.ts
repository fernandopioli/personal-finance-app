import { ValidationError } from '@domain/errors'

export class InvalidAccountTypeError extends ValidationError {
  constructor(field: string, value: string) {
    super(
      field,
      `The field "${field}" must be "corrente" or "poupanca". Current: ${value}`,
    )
  }
}
