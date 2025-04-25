import { UniqueId } from '@domain/core'
import { AccountType } from '@domain/account'

export interface AccountCreateInput {
  bankId: string
  name: string
  type: string
  agency?: string
  number?: string
}

export interface AccountUpdateInput {
  bankId?: string
  name?: string
  type?: string
  agency?: string
  number?: string
}

export interface AccountLoadInput {
  id: string
  bankId: string
  name: string
  type: string
  balance: number
  agency?: string
  number?: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface AccountProps {
  bankId: UniqueId
  name: string
  type: AccountType
  balance: number
  agency?: string
  number?: string
}
