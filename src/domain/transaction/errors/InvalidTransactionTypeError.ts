import { ValidationError } from '@domain/errors'

export class InvalidTransactionTypeError extends ValidationError {
  constructor(field: string, value: string) {
    super(
      field,
      `The field "${field}" must be "expense" or "income". Current: ${value}`,
    )
  }
}
