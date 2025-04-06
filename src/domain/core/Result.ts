export class Result<T> {
  private constructor(
    private readonly _success: boolean,
    private readonly _value?: T,
    private readonly _errors?: Error[],
  ) {}

  get isSuccess(): boolean {
    return this._success
  }

  get isFailure(): boolean {
    return !this.isSuccess
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get the value of a failed result.')
    }
    return this._value!
  }

  get errors(): Error[] {
    return this._errors!
  }

  public static ok<U>(value: U): Result<U> {
    return new Result<U>(true, value, [])
  }

  public static fail<U>(errors: Error[]): Result<U> {
    return new Result<U>(false, undefined, errors)
  }
}
