export abstract class ValidationError extends Error {
  public readonly field: string

  protected constructor(field: string, message: string) {
    super(message)
    this.field = field
    this.name = this.constructor.name

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
