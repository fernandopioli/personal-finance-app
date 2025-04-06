import { ValidationError } from '@domain/errors'

export class InvalidAccountBalanceError extends ValidationError {
  constructor(field: string, value: number) {
    super(field, `Balance cannot be negative. Current: ${value}`)
  }
}
