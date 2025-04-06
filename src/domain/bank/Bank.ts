import { Entity, Result } from '@domain/core'
import { Validator } from '@domain/validation'

interface BankInput {
  id: string
  name: string
  code: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class Bank extends Entity {
  private readonly _name: string
  private readonly _code: string

  private constructor(
    id: string,
    name: string,
    code: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._name = name
    this._code = code
  }

  public static load(input: BankInput): Result<Bank> {
    const validator = new Validator()
    validator.check('name', input.name).required().minLength(3)
    validator.check('code', input.code).required().minLength(3).maxLength(3)

    if (validator.hasErrors()) {
      return Result.fail<Bank>(validator.getErrors())
    }

    return Result.ok<Bank>(
      new Bank(
        input.id,
        input.name,
        input.code,
        input.createdAt,
        input.updatedAt,
        input.deletedAt,
      ),
    )
  }

  get name(): string {
    return this._name
  }

  get code(): string {
    return this._code
  }
}
