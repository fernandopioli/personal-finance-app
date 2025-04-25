import { ValidationError } from '@domain/errors'

export class InvalidTransactionSourceError extends ValidationError {
  constructor() {
    super(
      'source',
      'Transaction must be associated with either an account or an invoice, but not both',
    )
  }
}
