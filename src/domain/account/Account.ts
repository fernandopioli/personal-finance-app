import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import {
  InvalidAccountTypeError,
  InvalidAccountBalanceError,
} from '@domain/account/errors'
import {
  AccountCreateInput,
  AccountUpdateInput,
  AccountLoadInput,
  AccountProps,
} from '@domain/account'

export class Account extends Entity {
  private readonly _props: AccountProps

  private constructor(
    props: AccountProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._props = props
  }

  get bankId(): UniqueId {
    return this._props.bankId
  }
  get name(): string {
    return this._props.name
  }
  get type(): 'corrente' | 'poupanca' {
    return this._props.type
  }
  get balance(): number {
    return this._props.balance
  }
  get agency(): string | undefined {
    return this._props.agency
  }
  get number(): string | undefined {
    return this._props.number
  }

  public static create(input: AccountCreateInput): Result<Account> {
    const validationResult = this.validateCreate(input)

    if (validationResult.isFailure) {
      return Result.fail<Account>(validationResult.errors)
    }

    const props: AccountProps = {
      bankId: UniqueId.create(input.bankId),
      name: input.name,
      type: input.type,
      balance: 0,
      agency: input.agency,
      number: input.number,
    }

    const account = new Account(props)
    return Result.ok(account)
  }

  private static validateCreate(input: AccountCreateInput): Result<void> {
    const validator = new Validator()
    validator.check('bankId', input.bankId).required()
    validator.check('name', input.name).required().minLength(3)

    if (!this.isValidAccountType(input.type)) {
      validator.addError(new InvalidAccountTypeError('type', input.type))
    }

    if (input.agency) {
      validator.check('agency', input.agency).maxLength(10)
    }
    if (input.number) {
      validator.check('number', input.number).maxLength(20)
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  private static isValidAccountType(type: any): boolean {
    return ['corrente', 'poupanca'].includes(type)
  }

  private validateUpdate(input: AccountUpdateInput): Result<void> {
    const validator = new Validator()

    if (input.name) {
      validator.check('name', input.name).minLength(3)
    }

    if (input.type && !Account.isValidAccountType(input.type)) {
      validator.addError(new InvalidAccountTypeError('type', input.type))
    }

    if (input.agency) {
      validator.check('agency', input.agency).maxLength(10)
    }
    if (input.number) {
      validator.check('number', input.number).maxLength(20)
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  public static load(input: AccountLoadInput): Result<Account> {
    const props: AccountProps = {
      bankId: UniqueId.create(input.bankId),
      name: input.name,
      type: input.type,
      balance: input.balance,
      agency: input.agency,
      number: input.number,
    }

    const account = new Account(
      props,
      input.id,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    )
    return Result.ok(account)
  }

  public updateData(input: AccountUpdateInput): Result<void> {
    const validationResult = this.validateUpdate(input)

    if (validationResult.isFailure) {
      return Result.fail<void>(validationResult.errors)
    }

    if (input.bankId !== undefined)
      this._props.bankId = UniqueId.create(input.bankId)
    if (input.name !== undefined) this._props.name = input.name
    if (input.type !== undefined) this._props.type = input.type
    if (input.agency !== undefined) this._props.agency = input.agency
    if (input.number !== undefined) this._props.number = input.number

    this.updateTimestamp()
    return Result.ok(undefined)
  }

  public setBalance(newBalance: number): Result<void> {
    if (newBalance < 0) {
      return Result.fail<void>([
        new InvalidAccountBalanceError('balance', newBalance),
      ])
    }
    this._props.balance = newBalance
    this.updateTimestamp()
    return Result.ok(undefined)
  }
}
