import { Result } from '@domain/core'

describe('Result', () => {
  const createAndVerifyOkResult = <T>(value: T) => {
    const sut = Result.ok<T>(value)
    expect(sut.isSuccess).toBe(true)
    expect(sut.isFailure).toBe(false)
    expect(sut.value).toBe(value)
    expect(sut.errors).toEqual([])
    return sut
  }

  const createAndVerifyFailResult = <T>(errors: Error[]) => {
    const sut = Result.fail<T>(errors)
    expect(sut.isSuccess).toBe(false)
    expect(sut.isFailure).toBe(true)
    expect(sut.errors).toEqual(errors)
    return sut
  }

  it('should create a success result with a value', () => {
    createAndVerifyOkResult<number>(42)
  })

  it('should create a fail result with errors', () => {
    const errors = [new Error('Error A'), new Error('Error B')]
    createAndVerifyFailResult<number>(errors)
  })

  it('should throw an error if we try to get `value` from a fail result', () => {
    const sut = Result.fail<number>([new Error('Something went wrong')])
    expect(() => sut.value).toThrow('Cannot get the value of a failed result.')
  })

  it('should return an empty array for errors if the result is success', () => {
    const sut = Result.ok<string>('Hello')
    expect(sut.errors.length).toBe(0)
  })
})
