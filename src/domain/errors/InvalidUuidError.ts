import { ValidationError } from './ValidationError'

export class InvalidUuidError extends ValidationError {
  constructor(field: string, value: string) {
    super(field, `The field "${field}" must be a valid UUID. Current: ${value}`)
  }
}
