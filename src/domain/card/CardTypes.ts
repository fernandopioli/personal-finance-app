import { UniqueId } from '@domain/core'

export interface CardCreateInput {
  name: string
  limit: number
  closingDay: number
  dueDay: number
  accountId: string
}

export interface CardUpdateInput {
  name?: string
  limit?: number
  closingDay?: number
  dueDay?: number
  accountId?: string
}

export interface CardLoadInput {
  id: string
  name: string
  limit: number
  closingDay: number
  dueDay: number
  accountId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CardProps {
  name: string
  limit: number
  closingDay: number
  dueDay: number
  accountId: UniqueId
}
