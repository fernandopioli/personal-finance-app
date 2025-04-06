import { Entity, Result } from '@domain/core'
import { Validator } from '@domain/validation'

export class Bank extends Entity {
  private _name: string
  private _code: string

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

  public static load({
    id,
    name,
    code,
    createdAt,
    updatedAt,
    deletedAt,
  }: {
    id: string
    name: string
    code: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }): Result<Bank> {
    const validator = new Validator()
    validator.check('name', name).required().minLength(3)
    validator.check('code', code).required().minLength(3).maxLength(3)

    if (validator.hasErrors()) {
      return Result.fail<Bank>(validator.getErrors())
    }

    return Result.ok<Bank>(
      new Bank(id, name, code, createdAt, updatedAt, deletedAt),
    )
  }

  get name(): string {
    return this._name
  }

  get code(): string {
    return this._code
  }
}
