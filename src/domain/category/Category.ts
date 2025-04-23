import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import {
  CategoryCreateInput,
  CategoryLoadInput,
  CategoryUpdateInput,
  CategoryProps,
  CategoryType,
} from '@domain/category'
import { InvalidCategoryParentError } from '@domain/category/errors'
import { ValidationError } from '@domain/errors'

export class Category extends Entity {
  private readonly _props: CategoryProps

  private constructor(
    props: CategoryProps,
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

  get type(): CategoryType {
    return this._props.type
  }

  get description(): string | undefined {
    return this._props.description
  }

  get parentId(): UniqueId | undefined {
    return this._props.parentId
  }

  public isRoot(): boolean {
    return !this._props.parentId
  }

  public static create(input: CategoryCreateInput): Result<Category> {
    const validationResult = this.validateCreate(input)
    if (validationResult.isFailure) {
      return Result.fail<Category>(validationResult.errors)
    }

    const typeResult = CategoryType.create(input.type)

    const props: CategoryProps = {
      name: input.name,
      type: typeResult.value,
      description: input.description,
      parentId: input.parentId ? UniqueId.create(input.parentId) : undefined,
    }

    const category = new Category(props)
    return Result.ok(category)
  }

  public static load(input: CategoryLoadInput): Result<Category> {
    const typeResult = CategoryType.create(input.type)

    const props: CategoryProps = {
      name: input.name,
      type: typeResult.value,
      description: input.description,
      parentId: input.parentId ? UniqueId.create(input.parentId) : undefined,
    }

    const category = new Category(
      props,
      input.id,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    )
    return Result.ok(category)
  }

  public updateData(input: CategoryUpdateInput): Result<void> {
    const validationResult = this.validateUpdate(input)
    if (validationResult.isFailure) {
      return Result.fail<void>(validationResult.errors)
    }

    if (input.name !== undefined) {
      this._props.name = input.name
    }

    if (input.description !== undefined) {
      this._props.description = input.description
    }

    if (input.parentId !== undefined) {
      this._props.parentId = UniqueId.create(input.parentId)
    }

    if (input.type !== undefined) {
      const typeResult = CategoryType.create(input.type)
      this._props.type = typeResult.value
    }

    this.updateTimestamp()
    return Result.ok(undefined)
  }

  private static validateCreate(input: CategoryCreateInput): Result<void> {
    const validator = new Validator()
    validator.check('name', input.name).required().minLength(3)
    validator.check('type', input.type).required()

    if (input.parentId) {
      validator.check('parentId', input.parentId).isValidUuid()
    }

    const typeResult = CategoryType.validate(input.type)
    if (typeResult.isFailure) {
      validator.addErrors(typeResult.errors as ValidationError[])
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  private validateUpdate(input: CategoryUpdateInput): Result<void> {
    const validator = new Validator()

    if (input.name !== undefined) {
      validator.check('name', input.name).minLength(3)
    }

    if (input.parentId !== undefined) {
      validator.check('parentId', input.parentId).isValidUuid()

      if (input.parentId === this.id.value) {
        validator.addErrors([
          new InvalidCategoryParentError('parentId', this.id.value),
        ])
      }
    }

    if (input.type !== undefined) {
      const typeResult = CategoryType.validate(input.type)
      if (typeResult.isFailure) {
        validator.addErrors(typeResult.errors as ValidationError[])
      }
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }
}
