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

describe('Scenario 1: Creation', () => {
  it('should create an Entity with a generated id if none is provided', () => {
    const sut = new FakeEntity()

    expect(sut.id).toBeInstanceOf(UniqueId)
    expect(sut.createdAt).toBeInstanceOf(Date)
    expect(sut.updatedAt).toBeInstanceOf(Date)
    expect(sut.deletedAt).toBeNull()
  })

  it('should create an Entity with a given id and dates if provided', () => {
    const existingUuid = '123e4567-e89b-42d3-a456-556642440000'
    const createdAt = new Date('2021-01-01')
    const updatedAt = new Date('2021-01-02')
    const deletedAt = new Date('2021-01-03')

    const sut = new FakeEntity(existingUuid, createdAt, updatedAt, deletedAt)

    expect(sut.id.value).toBe(existingUuid)
    expect(sut.createdAt).toBe(createdAt)
    expect(sut.updatedAt).toBe(updatedAt)
    expect(sut.deletedAt).toBe(deletedAt)
  })
})

describe('Scenario 2: equals()', () => {
  it('equals() should return true if same instance', () => {
    const sut = new FakeEntity()

    const result = sut.equals(sut)

    expect(result).toBe(true)
  })

  it('equals() should return true if same id but different instances', () => {
    const id = UniqueId.create().value
    const sut = new FakeEntity(id)
    const other = new FakeEntity(id)

    const result = sut.equals(other)

    expect(result).toBe(true)
  })

  it('equals() should return false if different ids', () => {
    const sut = new FakeEntity(UniqueId.create().value)
    const other = new FakeEntity(UniqueId.create().value)

    const result = sut.equals(other)

    expect(result).toBe(false)
  })

  it('equals() should return false if other is null or undefined', () => {
    const sut = new FakeEntity()

    const resultNull = sut.equals(null as any)
    const resultUndef = sut.equals(undefined)

    expect(resultNull).toBe(false)
    expect(resultUndef).toBe(false)
  })
})
describe('Scenario 3: markAsDeleted()', () => {
  it('should have deletedAt = null initially, and set a date after markAsDeleted()', () => {
    const sut = new FakeEntity()

    expect(sut.deletedAt).toBeNull()

    sut.delete()

    expect(sut.deletedAt).toBeInstanceOf(Date)
  })
})

describe('Scenario 4: updateTimestamp()', () => {
  it('should update the updatedAt field to a new date/time when updateTimestamp is called', async () => {
    const initialDate = new Date('2025-01-01T12:00:00Z')
    const sut = new FakeEntity(undefined, initialDate, initialDate, null)

    const oldUpdatedAt = sut.updatedAt

    await new Promise((resolve) => setTimeout(resolve, 10))

    sut.update()

    const newUpdatedAt = sut.updatedAt

    expect(newUpdatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
  })
})
