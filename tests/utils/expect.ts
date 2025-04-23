import { Result } from '@domain/core'
import { ValidationError } from '@domain/errors'

export const expectFailureWithMessage = (
  result: Result<any>,
  messagePart: string,
  length: number = 1,
) => {
  expect(result.isFailure).toBe(true)
  expect(result.errors.length).toBeGreaterThanOrEqual(length)
  const hasMsg = result.errors.some((err: any) =>
    err.message.includes(messagePart),
  )
  expect(hasMsg).toBe(true)
}

export const expectSuccess = <T>(result: Result<T>) => {
  expect(result.isSuccess).toBe(true)
  return result.value
}

export const expectMultipleErrors = (
  result: Result<any>,
  expectedErrors: string[],
) => {
  expect(result.isFailure).toBe(true)
  expect(result.errors.length).toBe(expectedErrors.length)

  expectedErrors.forEach((expectedError, index) => {
    expect(result.errors[index].message).toBe(expectedError)
  })
}

export const expectFieldErrors = (
  result: Result<any>,
  expectedFields: string[],
) => {
  expect(result.isFailure).toBe(true)

  const errorFields = result.errors.map((e) => (e as ValidationError).field)

  expectedFields.forEach((field) => {
    expect(errorFields).toContain(field)
  })
}
