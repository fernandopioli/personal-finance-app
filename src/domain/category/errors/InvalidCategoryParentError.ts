import { ValidationError } from '@domain/errors'

export class InvalidCategoryParentError extends ValidationError {
  constructor(field: string, value: string) {
    super(field, `A category cannot be its own parent. Category ID: ${value}`)
  }
}
