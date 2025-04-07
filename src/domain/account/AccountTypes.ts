import { UniqueId } from '@domain/core'

export interface AccountCreateInput {
  bankId: string
  name: string
  type: 'corrente' | 'poupanca'
  agency?: string
  number?: string
}

export interface AccountUpdateInput {
  bankId?: string
  name?: string
  type?: 'corrente' | 'poupanca'
  agency?: string
  number?: string
}

export interface AccountLoadInput {
  id: string
  bankId: string
  name: string
  type: 'corrente' | 'poupanca'
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
  type: 'corrente' | 'poupanca'
  balance: number
  agency?: string
  number?: string
}
