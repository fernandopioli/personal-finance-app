import { ValueObject, Result } from '@domain/core'
import { InvalidAccountTypeError } from '@domain/account/errors'

export class AccountType extends ValueObject<string> {
  private static readonly CORRENTE = 'corrente'
  private static readonly POUPANCA = 'poupanca'

  private constructor(value: string) {
    super(value)
  }

  public static create(value: string): Result<AccountType> {
    const validationResult = this.validate(value)
    if (validationResult.isFailure) {
      return Result.fail(validationResult.errors)
    }
    return Result.ok(new AccountType(value))
  }

  public static validate(value: string): Result<void> {
    if (value === AccountType.CORRENTE || value === AccountType.POUPANCA) {
      return Result.ok(undefined)
    }
    return Result.fail([new InvalidAccountTypeError('type', value)])
  }
}
