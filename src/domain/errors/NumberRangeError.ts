import { ValidationError } from './ValidationError'

export class NumberRangeError extends ValidationError {
  constructor(field: string, min: number, max: number, actual: number) {
    super(
      field,
      `The field "${field}" must be between ${min} and ${max}. Current: ${actual}`,
    )
  }
}
