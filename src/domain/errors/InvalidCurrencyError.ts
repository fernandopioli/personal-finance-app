import { ValidationError } from '@domain/errors'

export class InvalidCurrencyError extends ValidationError {
  constructor(fieldName: string, value: number) {
    super(
      fieldName,
      `The field "${fieldName}" must be a valid currency value. Current: ${value}`,
    )
  }
}
