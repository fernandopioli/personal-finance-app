import { ValidationError } from '@domain/errors'

export class ArrayNotEmptyError extends ValidationError {
  constructor(field: string) {
    super(
      field,
      `The field "${field}" must have at least one item in the List.`,
    )
  }
}
