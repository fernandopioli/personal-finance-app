import { Entity, Result } from '@domain/core'
import { Validator } from '@domain/validation'

export interface BankProps {
  name: string
  code: string
}

interface BankInput {
  id: string
  name: string
  code: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class Bank extends Entity {
  private readonly _props: BankProps

  private constructor(
    props: BankProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._props = props
  }

  public static load(input: BankInput): Result<Bank> {
    const validator = new Validator()
    validator.check('name', input.name).required().minLength(3)
    validator.check('code', input.code).required().minLength(3).maxLength(3)

    if (validator.hasErrors()) {
      return Result.fail<Bank>(validator.getErrors())
    }

    const props: BankProps = {
      name: input.name,
      code: input.code,
    }

    return Result.ok<Bank>(
      new Bank(
        props,
        input.id,
        input.createdAt,
        input.updatedAt,
        input.deletedAt,
      ),
    )
  }

  get name(): string {
    return this._props.name
  }

  get code(): string {
    return this._props.code
  }
}
