import { UniqueId } from '@domain/core'
import { TransactionType } from './TransactionType'

export interface TransactionCreateInput {
  date: Date
  type: string
  description: string
  categoryId: string
  amount: number
  accountId?: string
  invoiceId?: string
  currentInstallment?: number
  totalInstallments?: number
  installmentGroupId?: string
}

export interface TransactionUpdateInput {
  date?: Date
  type?: string
  description?: string
  categoryId?: string
  amount?: number
}

export interface TransactionLoadInput {
  id: string
  date: Date
  type: string
  description: string
  categoryId: string
  amount: number
  accountId?: string
  invoiceId?: string
  currentInstallment?: number
  totalInstallments?: number
  installmentGroupId?: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface TransactionProps {
  date: Date
  type: TransactionType
  description: string
  categoryId: UniqueId
  amount: number
  accountId?: UniqueId
  invoiceId?: UniqueId
  currentInstallment?: number
  totalInstallments?: number
  installmentGroupId?: UniqueId
}
