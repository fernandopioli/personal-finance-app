import { ValidationError } from '@domain/errors'

export class InvalidMoneyValueError extends ValidationError {
  constructor(field: string, value: any) {
    let message: string

    if (field === 'amount') {
      message = `The field "${field}" must be a valid monetary value with up to 2 decimal places. Received: ${value}`
    } else if (field === 'currency') {
      message = `The field "${field}" must be a valid ISO 4217 currency code (3 uppercase letters). Received: ${value}`
    }

    super(field, message!)
  }
}
