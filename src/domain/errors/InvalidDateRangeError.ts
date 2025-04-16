import { ValidationError } from '@domain/errors'

export class InvalidDateRangeError extends ValidationError {
  constructor(field: string, startFieldName: string) {
    super(field, `The field "${field}" must be after ${startFieldName}`)
  }
}
