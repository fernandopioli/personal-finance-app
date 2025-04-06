import { ValidationError } from '@domain/errors'

export class RequiredFieldError extends ValidationError {
  constructor(field: string) {
    super(field, `The field "${field}" is required.`)
  }
}
