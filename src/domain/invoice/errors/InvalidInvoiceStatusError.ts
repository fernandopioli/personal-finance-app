import { ValidationError } from '@domain/errors'

export class InvalidInvoiceStatusError extends ValidationError {
  constructor(field: string, value: string) {
    super(
      field,
      `The field "${field}" must be "open", "closed" or "paid". Current: ${value}`,
    )
  }
}
