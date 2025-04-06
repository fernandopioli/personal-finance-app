import { UniqueId } from '@domain/core'
import { validate as uuidValidate } from 'uuid'

describe('UniqueId', () => {
  const createId = (id?: string) => UniqueId.create(id)
  const assertValidUuid = (id: UniqueId) =>
    expect(uuidValidate(id.value)).toBe(true)
  const assertIdEquals = (id: UniqueId, value: string) =>
    expect(id.value).toBe(value)
  const assertThrows = (fn: () => void, message: string) =>
    expect(fn).toThrow(message)

  describe('create()', () => {
    it('should create a valid UniqueId when called without argument', () => {
      const sut = createId()
      assertValidUuid(sut)
    })

    it('should create UniqueId with given valid UUID', () => {
      const existingUuid = '123e4567-e89b-42d3-a456-556642440000'
      const sut = createId(existingUuid)
      assertIdEquals(sut, existingUuid)
    })

    it('should throw error if given invalid UUID', () => {
      const invalidId = 'not-a-valid-uuid'
      assertThrows(() => createId(invalidId), 'Invalid UUID')
    })
  })
})
