import { ValidationError } from '@domain/errors'

export class IncompatibleCurrencyError extends ValidationError {
  constructor(operation: string, currency1: string, currency2: string) {
    super(
      'currency',
      `Cannot ${operation} money with different currencies: ${currency1} and ${currency2}. Currencies must match.`,
    )
  }

  static forAddition(
    currency1: string,
    currency2: string,
  ): IncompatibleCurrencyError {
    return new IncompatibleCurrencyError('add', currency1, currency2)
  }

  static forSubtraction(
    currency1: string,
    currency2: string,
  ): IncompatibleCurrencyError {
    return new IncompatibleCurrencyError('subtract', currency1, currency2)
  }
}
