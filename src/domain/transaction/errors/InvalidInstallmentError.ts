import { ValidationError } from '@domain/errors'

export class InvalidInstallmentError extends ValidationError {
  constructor(message: string) {
    super('installment', message)
  }

  static currentGreaterThanTotal(
    current: number,
    total: number,
  ): InvalidInstallmentError {
    return new InvalidInstallmentError(
      `Current installment (${current}) cannot be greater than total installments (${total})`,
    )
  }

  static missingTotalInstallments(): InvalidInstallmentError {
    return new InvalidInstallmentError(
      'Total installments is required when current installment is provided',
    )
  }

  static missingGroupId(): InvalidInstallmentError {
    return new InvalidInstallmentError(
      'Installment group ID is required for installment transactions',
    )
  }

  static missingCurrentInstallment(): InvalidInstallmentError {
    return new InvalidInstallmentError(
      'Current installment is required when total installments is provided',
    )
  }

  static invalidValue(
    fieldName: string,
    value: number,
  ): InvalidInstallmentError {
    return new InvalidInstallmentError(
      `Invalid ${fieldName} value: ${value}. Must be a positive integer.`,
    )
  }
}
