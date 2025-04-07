import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import {
  CardCreateInput,
  CardLoadInput,
  CardUpdateInput,
  CardProps,
} from '@domain/card'
import { InvalidUuidError } from '@domain/errors'

export class Card extends Entity {
  private readonly _props: CardProps

  private constructor(
    props: CardProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._props = props
  }

  get name(): string {
    return this._props.name
  }

  get limit(): number {
    return this._props.limit
  }

  get closingDay(): number {
    return this._props.closingDay
  }

  get dueDay(): number {
    return this._props.dueDay
  }

  get accountId(): UniqueId {
    return this._props.accountId
  }

  public static create(input: CardCreateInput): Result<Card> {
    const validationResult = this.validateCreate(input)

    if (validationResult.isFailure) {
      return Result.fail<Card>(validationResult.errors)
    }

    const props: CardProps = {
      name: input.name,
      limit: input.limit,
      closingDay: input.closingDay,
      dueDay: input.dueDay,
      accountId: UniqueId.create(input.accountId),
    }

    const card = new Card(props)
    return Result.ok(card)
  }

  public static load(input: CardLoadInput): Result<Card> {
    const props: CardProps = {
      name: input.name,
      limit: input.limit,
      closingDay: input.closingDay,
      dueDay: input.dueDay,
      accountId: UniqueId.create(input.accountId),
    }

    const card = new Card(
      props,
      input.id,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    )
    return Result.ok(card)
  }

  private static validateCreate(
    input: CardCreateInput | CardLoadInput,
  ): Result<void> {
    const validator = new Validator()

    validator.check('name', input.name).required().minLength(3)
    validator.check('limit', input.limit).required().minNumber(0)
    validator
      .check('closingDay', input.closingDay)
      .required()
      .numberInRange(1, 31)
    validator.check('dueDay', input.dueDay).required().numberInRange(1, 31)
    validator.check('accountId', input.accountId).required().isValidUuid()

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  public updateData(input: CardUpdateInput): Result<void> {
    const validationResult = this.validateUpdate(input)

    if (validationResult.isFailure) {
      return Result.fail<void>(validationResult.errors)
    }

    if (input.name !== undefined) this._props.name = input.name
    if (input.limit !== undefined) this._props.limit = input.limit
    if (input.closingDay !== undefined)
      this._props.closingDay = input.closingDay
    if (input.dueDay !== undefined) this._props.dueDay = input.dueDay
    if (input.accountId !== undefined) {
      this._props.accountId = UniqueId.create(input.accountId)
    }

    this.updateTimestamp()
    return Result.ok(undefined)
  }

  private validateUpdate(input: CardUpdateInput): Result<void> {
    const validator = new Validator()

    if (input.name !== undefined) {
      validator.check('name', input.name).minLength(3)
    }

    if (input.limit !== undefined) {
      validator.check('limit', input.limit).minNumber(0)
    }

    if (input.closingDay !== undefined) {
      validator.check('closingDay', input.closingDay).numberInRange(1, 31)
    }

    if (input.dueDay !== undefined) {
      validator.check('dueDay', input.dueDay).numberInRange(1, 31)
    }

    if (input.accountId !== undefined) {
      validator.check('accountId', input.accountId).isValidUuid()
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  public updateLimit(newLimit: number): Result<void> {
    const validator = new Validator()

    validator.check('limit', newLimit).minNumber(0)

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    this._props.limit = newLimit
    this.updateTimestamp()
    return Result.ok(undefined)
  }
}
