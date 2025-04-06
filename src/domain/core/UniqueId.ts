import { ValueObject } from '@domain/core'
import {
  v4 as uuidv4,
  validate as uuidValidate,
  version as uuidVersion,
} from 'uuid'

export class UniqueId extends ValueObject<string> {
  constructor(value: string) {
    super(value)
  }

  public static create(id?: string): UniqueId {
    if (!id) {
      return new UniqueId(uuidv4())
    }

    if (!this.isValid(id)) {
      throw new Error('Invalid UUID')
    }

    return new UniqueId(id)
  }

  public static isValid(id: string): boolean {
    return uuidValidate(id) && uuidVersion(id) === 4
  }
}
