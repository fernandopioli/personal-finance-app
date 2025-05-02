import { UniqueId } from '@domain/core'
import { domainAssert } from '@tests/framework'

describe('UniqueId', () => {
  describe('create()', () => {
    it('should create a valid UniqueId when called without argument', () => {
      const id = UniqueId.create()

      domainAssert.expectValidValueObject(id)
      domainAssert.expectValidUniqueId(id)
    })

    it('should create UniqueId with given valid UUID', () => {
      const existingUuid = '123e4567-e89b-42d3-a456-556642440000'
      const id = UniqueId.create(existingUuid)

      domainAssert.expectUniqueIdEquals(id, existingUuid)
    })

    it('should throw error if given invalid UUID', () => {
      const invalidId = 'not-a-valid-uuid'

      domainAssert.expectThrows(
        () => UniqueId.create(invalidId),
        'Invalid UUID',
      )
    })
  })

  describe('isValid()', () => {
    it('should return true for valid UUIDs', () => {
      const validUuid = '123e4567-e89b-42d3-a456-556642440000'

      domainAssert.assertTrue(UniqueId.isValid(validUuid))
    })

    it('should return false for invalid UUIDs', () => {
      const invalidValues = [
        'not-a-uuid',
        '123',
        '123e4567-e89b-XXXX-a456-556642440000',
        null,
        undefined,
      ]

      invalidValues.forEach((value) => {
        domainAssert.assertFalse(
          UniqueId.isValid(value as any),
          `Expected ${value} to be invalid`,
        )
      })
    })
  })

  describe('toString()', () => {
    it('should return the string representation of the UUID', () => {
      const uuidString = '123e4567-e89b-42d3-a456-556642440000'
      const id = UniqueId.create(uuidString)

      domainAssert.assertEqual(id.value, uuidString)
    })
  })
})
