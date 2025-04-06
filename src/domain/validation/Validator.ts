import { ValidationError } from '@domain/errors'
import { FieldValidator } from '@domain/validation'

export class Validator {
  private errors: ValidationError[] = []

  public check(fieldName: string, value: any): FieldValidator {
    return new FieldValidator(fieldName, value, this.errors)
  }

  public getErrors(): ValidationError[] {
    return this.errors
  }

  public hasErrors(): boolean {
    return this.errors.length > 0
  }
}
