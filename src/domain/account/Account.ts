import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import { InvalidAccountBalanceError } from '@domain/account/errors'
import {
  AccountCreateInput,
  AccountUpdateInput,
  AccountLoadInput,
  AccountProps,
  AccountType,
} from '@domain/account'
import { ValidationError } from '@domain/errors'

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
  get type(): AccountType {
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

    const accountTypeResult = AccountType.create(input.type)

    const props: AccountProps = {
      bankId: UniqueId.create(input.bankId),
      name: input.name,
      type: accountTypeResult.value,
      balance: 0,
      agency: input.agency,
      number: input.number,
    }

    const account = new Account(props)
    return Result.ok(account)
  }

  private static validateCreate(input: AccountCreateInput): Result<void> {
    const validator = new Validator()
    validator.check('bankId', input.bankId).required().isValidUuid()
    validator.check('name', input.name).required().minLength(3)
    validator.check('type', input.type).required()

    if (input.agency) {
      validator.check('agency', input.agency).maxLength(10)
    }
    if (input.number) {
      validator.check('number', input.number).maxLength(20)
    }

    const accountTypeResult = AccountType.validate(input.type)
    if (accountTypeResult.isFailure) {
      validator.addErrors(accountTypeResult.errors as ValidationError[])
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  private validateUpdate(input: AccountUpdateInput): Result<void> {
    const validator = new Validator()

    if (input.name) {
      validator.check('name', input.name).minLength(3)
    }

    if (input.bankId) {
      validator.check('bankId', input.bankId).isValidUuid()
    }

    if (input.agency) {
      validator.check('agency', input.agency).maxLength(10)
    }
    if (input.number) {
      validator.check('number', input.number).maxLength(20)
    }

    if (input.type) {
      const accountTypeResult = AccountType.validate(input.type)
      if (accountTypeResult.isFailure) {
        validator.addErrors(accountTypeResult.errors as ValidationError[])
      }
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  public static load(input: AccountLoadInput): Result<Account> {
    const accountTypeResult = AccountType.create(input.type)

    const props: AccountProps = {
      bankId: UniqueId.create(input.bankId),
      name: input.name,
      type: accountTypeResult.value,
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

    if (input.type !== undefined) {
      const accountTypeResult = AccountType.create(input.type)

      this._props.type = accountTypeResult.value
    }

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
