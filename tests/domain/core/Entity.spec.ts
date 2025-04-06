import { Entity, UniqueId } from '@domain/core'

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
  const createEntity = (
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) => new FakeEntity(id, createdAt, updatedAt, deletedAt)

  const assertValidEntity = (entity: FakeEntity) => {
    expect(entity.id).toBeInstanceOf(UniqueId)
    expect(entity.createdAt).toBeInstanceOf(Date)
    expect(entity.updatedAt).toBeInstanceOf(Date)
  }

  const assertEntityEquals = (
    entity: FakeEntity,
    other: FakeEntity,
    expected: boolean,
  ) => {
    expect(entity.equals(other)).toBe(expected)
  }

  const assertDateGreaterThan = (date1: Date, date2: Date) => {
    expect(date1.getTime()).toBeGreaterThan(date2.getTime())
  }

  describe('constructor', () => {
    it('should create an Entity with a generated id if none is provided', () => {
      const sut = createEntity()

      assertValidEntity(sut)
      expect(sut.deletedAt).toBeNull()
    })

    it('should create an Entity with a given id and dates if provided', () => {
      const existingUuid = '123e4567-e89b-42d3-a456-556642440000'
      const createdAt = new Date('2021-01-01')
      const updatedAt = new Date('2021-01-02')
      const deletedAt = new Date('2021-01-03')

      const sut = createEntity(existingUuid, createdAt, updatedAt, deletedAt)

      expect(sut.id.value).toBe(existingUuid)
      expect(sut.createdAt).toBe(createdAt)
      expect(sut.updatedAt).toBe(updatedAt)
      expect(sut.deletedAt).toBe(deletedAt)
    })
  })

  describe('equals()', () => {
    it('should return true if same instance', () => {
      const sut = createEntity()
      assertEntityEquals(sut, sut, true)
    })

    it('should return true if same id but different instances', () => {
      const id = UniqueId.create().value
      const sut = createEntity(id)
      const other = createEntity(id)

      assertEntityEquals(sut, other, true)
    })

    it('should return false if different ids', () => {
      const sut = createEntity(UniqueId.create().value)
      const other = createEntity(UniqueId.create().value)

      assertEntityEquals(sut, other, false)
    })

    it('should return false if other is null or undefined', () => {
      const sut = createEntity()

      expect(sut.equals(null as any)).toBe(false)
      expect(sut.equals(undefined)).toBe(false)
    })
  })

  describe('markAsDeleted()', () => {
    it('should set deletedAt to current date when called', () => {
      const sut = createEntity()

      expect(sut.deletedAt).toBeNull()

      sut.delete()

      expect(sut.deletedAt).toBeInstanceOf(Date)
    })
  })

  describe('updateTimestamp()', () => {
    it('should update the updatedAt field to a new date/time', async () => {
      const initialDate = new Date('2025-01-01T12:00:00Z')
      const sut = createEntity(undefined, initialDate, initialDate, null)

      const oldUpdatedAt = sut.updatedAt

      await new Promise((resolve) => setTimeout(resolve, 10))

      sut.update()

      assertDateGreaterThan(sut.updatedAt, oldUpdatedAt)
    })
  })
})
