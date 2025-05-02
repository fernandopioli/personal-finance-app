import { Entity, UniqueId } from '@domain/core'
import { domainAssert } from '@tests/framework'

class FakeEntity extends Entity {
  constructor(
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }

  delete(): void {
    this.markAsDeleted()
  }

  update(): void {
    this.updateTimestamp()
  }
}

describe('Entity', () => {
  describe('constructor', () => {
    it('should create an Entity with a generated id if none is provided', () => {
      const entity = new FakeEntity()

      domainAssert.expectValidEntity(entity)
      domainAssert.assertEqual(entity.deletedAt, null)
    })

    it('should create an Entity with a given id and dates if provided', () => {
      const existingUuid = '123e4567-e89b-42d3-a456-556642440000'
      const createdAt = new Date('2021-01-01')
      const updatedAt = new Date('2021-01-02')
      const deletedAt = new Date('2021-01-03')

      const entity = new FakeEntity(
        existingUuid,
        createdAt,
        updatedAt,
        deletedAt,
      )

      domainAssert.expectUniqueIdEquals(entity.id, existingUuid)
      domainAssert.assertEqual(entity.createdAt, createdAt)
      domainAssert.assertEqual(entity.updatedAt, updatedAt)
      domainAssert.assertEqual(entity.deletedAt, deletedAt)
    })
  })

  describe('equals()', () => {
    it('should return true if same instance', () => {
      const entity = new FakeEntity()

      domainAssert.assertTrue(entity.equals(entity))
    })

    it('should return true if same id but different instances', () => {
      const id = UniqueId.create().value
      const entity1 = new FakeEntity(id)
      const entity2 = new FakeEntity(id)

      domainAssert.assertTrue(entity1.equals(entity2))
    })

    it('should return false if different ids', () => {
      const entity1 = new FakeEntity(UniqueId.create().value)
      const entity2 = new FakeEntity(UniqueId.create().value)

      domainAssert.assertFalse(entity1.equals(entity2))
    })

    it('should return false if other is null or undefined', () => {
      const entity = new FakeEntity()

      domainAssert.assertFalse(entity.equals(null as any))
      domainAssert.assertFalse(entity.equals(undefined))
    })
  })

  describe('markAsDeleted()', () => {
    it('should set deletedAt to current date when called', () => {
      const entity = new FakeEntity()

      domainAssert.assertEqual(entity.deletedAt, null)

      entity.delete()

      domainAssert.assertTrue(entity.deletedAt instanceof Date)
    })
  })

  describe('updateTimestamp()', () => {
    it('should update the updatedAt field to a new date/time', async () => {
      const initialDate = new Date('2025-01-01T12:00:00Z')
      const entity = new FakeEntity(undefined, initialDate, initialDate, null)

      const oldUpdatedAt = entity.updatedAt

      await new Promise((resolve) => setTimeout(resolve, 10))

      entity.update()

      domainAssert.assertTrue(
        entity.updatedAt.getTime() > oldUpdatedAt.getTime(),
        'Expected updatedAt to be greater than previous value',
      )
    })
  })
})
