import { UniqueId } from '@domain/core'
import { CategoryType } from '@domain/category'

export interface CategoryCreateInput {
  name: string
  type: string
  description?: string
  parentId?: string
}

export interface CategoryUpdateInput {
  name?: string
  type?: string
  description?: string
  parentId?: string
}

export interface CategoryLoadInput {
  id: string
  name: string
  type: string
  description?: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CategoryProps {
  name: string
  type: CategoryType
  description?: string
  parentId?: UniqueId
}
