import { UniqueId } from '@domain/core'

export type InvoiceStatus = 'open' | 'closed' | 'paid'

export interface InvoiceCreateInput {
  cardId: string
  dueDate: Date
  startDate: Date
  endDate: Date
  totalAmount?: number
  status?: InvoiceStatus
}

export interface InvoiceUpdateInput {
  dueDate?: Date
  startDate?: Date
  endDate?: Date
  totalAmount?: number
  status?: InvoiceStatus
}

export interface InvoiceLoadInput {
  id: string
  cardId: string
  dueDate: Date
  startDate: Date
  endDate: Date
  totalAmount: number
  status: InvoiceStatus
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
