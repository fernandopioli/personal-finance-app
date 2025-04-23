import { UniqueId } from '@domain/core'
import { InvoiceStatus } from '@domain/invoice'

export interface InvoiceCreateInput {
  cardId: string
  dueDate: Date
  startDate: Date
  endDate: Date
  totalAmount?: number
  status?: string
}

export interface InvoiceUpdateInput {
  dueDate?: Date
  startDate?: Date
  endDate?: Date
  totalAmount?: number
  status?: string
}

export interface InvoiceLoadInput {
  id: string
  cardId: string
  dueDate: Date
  startDate: Date
  endDate: Date
  totalAmount: number
  status: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface InvoiceProps {
  cardId: UniqueId
  dueDate: Date
  startDate: Date
  endDate: Date
  totalAmount: number
  status: InvoiceStatus
}
