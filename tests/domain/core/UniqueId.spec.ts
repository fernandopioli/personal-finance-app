import { UniqueId } from '@domain/core'
import { validate as uuidValidate } from 'uuid'
describe('UniqueId', () => {
  it('should create a valid UniqueId when called without argument', () => {
    const sut = UniqueId.create()

    expect(uuidValidate(sut.value)).toBe(true)
  })

  it('should create UniqueId with given valid UUID', () => {
    const existingUuid = '123e4567-e89b-42d3-a456-556642440000'
    const sut = UniqueId.create(existingUuid)
    expect(sut.value).toBe(existingUuid)
  })

  it('should throw error if given invalid UUID', () => {
    const invalidId = 'not-a-valid-uuid'
    expect(() => UniqueId.create(invalidId)).toThrow('Invalid UUID')
  })
})
