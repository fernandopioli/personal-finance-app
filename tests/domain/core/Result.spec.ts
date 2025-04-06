import { Result } from '@domain/core'

describe('Result', () => {
  it('should create a success result with a value', () => {
    const sut = Result.ok<number>(42)
    expect(sut.isSuccess).toBe(true)
    expect(sut.isFailure).toBe(false)
    expect(sut.value).toBe(42)
    expect(sut.errors.length).toBe(0)
    expect(sut.errors).toEqual([])
  })

  it('should create a fail result with errors', () => {
    const errors = [new Error('Error A'), new Error('Error B')]
    const sut = Result.fail<Error>(errors)

    expect(sut.isSuccess).toBe(false)
    expect(sut.isFailure).toBe(true)
    expect(sut.errors).toEqual(errors)
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
