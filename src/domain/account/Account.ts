import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import {
  InvalidAccountTypeError,
  InvalidAccountBalanceError,
} from '@domain/account/errors'

export interface AccountCreateInput {
  bankId: string
  name: string
  type: 'corrente' | 'poupanca'
  agency?: string
  number?: string
}
export interface AccountUpdateInput {
  bankId?: string
  name?: string
  type?: 'corrente' | 'poupanca'
  agency?: string
  number?: string
}

export interface AccountLoadInput {
  id: string
  bankId: string
  name: string
  type: 'corrente' | 'poupanca'
  balance: number
  agency?: string
  number?: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class Account extends Entity {
  private _bankId: UniqueId
  private _name: string
  private _type: 'corrente' | 'poupanca'
  private _balance: number
  private _agency?: string
  private _number?: string

  private constructor(
    bankId: UniqueId,
    name: string,
    type: 'corrente' | 'poupanca',
    balance: number,
    agency: string | undefined,
    number: string | undefined,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._bankId = bankId
    this._name = name
    this._type = type
    this._balance = balance
    this._agency = agency
    this._number = number
  }

  get bankId(): UniqueId {
    return this._bankId
  }
  get name(): string {
    return this._name
  }
  get type(): 'corrente' | 'poupanca' {
    return this._type
  }
  get balance(): number {
    return this._balance
  }
  get agency(): string | undefined {
    return this._agency
  }
  get number(): string | undefined {
    return this._number
  }

  public static create(input: AccountCreateInput): Result<Account> {
    const validationResult = this.validateCreate(input)

    if (validationResult.isFailure) {
      return Result.fail<Account>(validationResult.errors)
    }

    const account = new Account(
      UniqueId.create(input.bankId),
      input.name,
      input.type,
      0,
      input.agency,
      input.number,
    )
    return Result.ok(account)
  }

  private static validateCreate(input: AccountCreateInput): Result<void> {
    const validator = new Validator()
    validator.check('bankId', input.bankId).required()
    validator.check('name', input.name).required().minLength(3)

    if (!['corrente', 'poupanca'].includes(input.type)) {
      validator.check('type', input.type).required()
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

  private validateUpdate(input: AccountUpdateInput): Result<void> {
    const validator = new Validator()
    if (input.name) {
      validator.check('name', input.name).minLength(3)
    }

    if (input.type && !['corrente', 'poupanca'].includes(input.type)) {
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
    const account = new Account(
      UniqueId.create(input.bankId),
      input.name,
      input.type,
      input.balance,
      input.agency,
      input.number,
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

    if (input.bankId !== undefined) this._bankId = UniqueId.create(input.bankId)
    if (input.name !== undefined) this._name = input.name
    if (input.type !== undefined) this._type = input.type
    if (input.agency !== undefined) this._agency = input.agency
    if (input.number !== undefined) this._number = input.number

    this.updateTimestamp()
    return Result.ok(undefined)
  }

  public setBalance(newBalance: number): Result<void> {
    if (newBalance < 0) {
      return Result.fail<void>([
        new InvalidAccountBalanceError('balance', newBalance),
      ])
    }
    this._balance = newBalance
    this.updateTimestamp()
    return Result.ok(undefined)
  }
}
