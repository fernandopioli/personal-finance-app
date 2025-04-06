import { UniqueId } from '@domain/core'

export abstract class Entity {
  private readonly _id: UniqueId
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date | null

  protected constructor(
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this._id = id ? UniqueId.create(id) : UniqueId.create()

    this._createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
    this._deletedAt = deletedAt ?? null
  }

  get id(): UniqueId {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get deletedAt(): Date | null {
    return this._deletedAt
  }

  protected markAsDeleted(): void {
    if (!this._deletedAt) {
      this._deletedAt = new Date()
    }
  }

  protected updateTimestamp(): void {
    this._updatedAt = new Date()
  }

  public equals(other?: Entity): boolean {
    if (!other) return false
    if (this === other) return true
    return this._id.equals(other._id)
  }
}
