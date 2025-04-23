import { ValueObject, Result } from '@domain/core'
import { InvalidTransactionTypeError } from '@domain/transaction/errors'

export class TransactionType extends ValueObject<string> {
  private static readonly EXPENSE = 'expense'
  private static readonly INCOME = 'income'

  private constructor(value: string) {
    super(value)
  }

  public static create(value: string): Result<TransactionType> {
    const validationResult = this.validate(value)
    if (validationResult.isFailure) {
      return Result.fail(validationResult.errors)
    }
    return Result.ok(new TransactionType(value))
  }

  public static validate(value: string): Result<void> {
    if (value === TransactionType.EXPENSE || value === TransactionType.INCOME) {
      return Result.ok(undefined)
    }
    return Result.fail([new InvalidTransactionTypeError('type', value)])
  }
}
