export abstract class ValueObject<T> {
  private readonly _value: T

  constructor(value: T) {
    this._value = this.deepFreeze(value)
  }

  get value(): T {
    return this._value
  }

  equals(other?: ValueObject<T>): boolean {
    if (!other) return false
    if (this === other) {
      return true
    }
    return JSON.stringify(this.value) === JSON.stringify(other.value)
  }

  private deepFreeze<U>(obj: U): U {
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }

    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const value = (obj as any)[prop]
      if (
        typeof value === 'object' &&
        value !== null &&
        !Object.isFrozen(value)
      ) {
        this.deepFreeze(value)
      }
    })

    return Object.freeze(obj)
  }
}
