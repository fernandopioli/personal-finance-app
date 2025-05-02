import { Result } from '@domain/core'
import { domainAssert } from '@tests/framework'

describe('Result', () => {
  describe('ok()', () => {
    it('should create a success result with a value', () => {
      const result = Result.ok<number>(42)
      domainAssert.expectResultSuccess(result)
      domainAssert.assertEqual(result.value, 42)
    })

    it('should return an empty array for errors if the result is success', () => {
      const result = Result.ok<string>('Hello')
      domainAssert.assertLength(result.errors, 0)
    })
  })

  describe('fail()', () => {
    it('should create a fail result with errors', () => {
      const errors = [new Error('Error A'), new Error('Error B')]
      const result = Result.fail<number>(errors)

      const returnedErrors = domainAssert.expectResultFailure(result, errors)
      domainAssert.assertEqual(returnedErrors, errors)
    })

    it('should throw an error if we try to get `value` from a fail result', () => {
      const result = Result.fail<number>([new Error('Something went wrong')])

      domainAssert.expectThrows(
        () => result.value,
        'Cannot get the value of a failed result.',
      )
    })
  })
})
