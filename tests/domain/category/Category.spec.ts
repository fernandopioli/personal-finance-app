import { Category } from '@domain/category'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'

describe('Category Entity', () => {
  const validCreateData = {
    name: 'Alimentação',
    type: 'expense',
  }

  const validLoadData = {
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    name: 'Transporte',
    type: 'expense',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const createCategory = (overrides = {}) =>
    Category.create({ ...validCreateData, ...overrides })

  const loadCategory = (overrides = {}) =>
    Category.load({ ...validLoadData, ...overrides })

  describe('create()', () => {
    it('should create a valid expense category', () => {
      const category = expectSuccess(createCategory())

      expect(category.id).toBeDefined()
      expect(category.name).toBe(validCreateData.name)
      expect(category.type.value).toBe(validCreateData.type)
      expect(category.description).toBeUndefined()
      expect(category.parentId).toBeUndefined()
      expect(category.isRoot()).toBe(true)
    })

    it('should create a valid income category', () => {
      const category = expectSuccess(createCategory({ type: 'income' }))
      expect(category.type.value).toBe('income')
    })

    it('should create a category with description', () => {
      const description = 'Despesas com alimentação'
      const category = expectSuccess(createCategory({ description }))
      expect(category.description).toBe(description)
    })

    it('should create a subcategory', () => {
      const parentId = '8f2bd772-6af8-48a2-9326-6ef5049d51fa'
      const category = expectSuccess(createCategory({ parentId }))

      expect(category.parentId?.value).toBe(parentId)
      expect(category.isRoot()).toBe(false)
    })

    it('should fail if name is empty', () => {
      const result = createCategory({ name: '' })
      expectFailureWithMessage(result, '"name" is required')
    })

    it('should fail if name is too short', () => {
      const result = createCategory({ name: 'AB' })
      expectFailureWithMessage(
        result,
        'The field "name" must be at least 3 characters',
      )
    })

    it('should fail if type is invalid', () => {
      const result = createCategory({ type: 'invalid-type' })
      expectFailureWithMessage(
        result,
        'The field "type" must be "expense" or "income"',
      )
    })

    it('should fail if parentId is not a valid UUID', () => {
      const result = createCategory({ parentId: 'not-a-valid-uuid' })
      expectFailureWithMessage(result, 'must be a valid UUID')
    })
  })

  describe('load()', () => {
    it('should load a valid category', () => {
      const category = expectSuccess(loadCategory())

      expect(category.id.value).toBe(validLoadData.id)
      expect(category.name).toBe(validLoadData.name)
      expect(category.type.value).toBe(validLoadData.type)
      expect(category.isRoot()).toBe(true)
    })

    it('should load a subcategory', () => {
      const parentId = '8f2bd772-6af8-48a2-9326-6ef5049d51fb'
      const category = expectSuccess(loadCategory({ parentId }))

      expect(category.parentId?.value).toBe(parentId)
      expect(category.isRoot()).toBe(false)
    })
  })

  describe('updateData()', () => {
    it('should update name', () => {
      const category = expectSuccess(loadCategory())
      const newName = 'Transporte Público'

      expectSuccess(category.updateData({ name: newName }))
      expect(category.name).toBe(newName)
    })

    it('should update type', () => {
      const category = expectSuccess(loadCategory())

      expectSuccess(category.updateData({ type: 'income' }))
      expect(category.type.value).toBe('income')
    })

    it('should update description', () => {
      const category = expectSuccess(loadCategory())
      const description = 'Transporte público e privado'

      expectSuccess(category.updateData({ description }))
      expect(category.description).toBe(description)
    })

    it('should update parentId', () => {
      const category = expectSuccess(loadCategory())
      const parentId = '8f2bd772-6af8-48a2-9326-6ef5049d51fb'

      expectSuccess(category.updateData({ parentId }))
      expect(category.parentId?.value).toBe(parentId)
      expect(category.isRoot()).toBe(false)
    })

    it('should fail if name is too short', () => {
      const category = expectSuccess(loadCategory())
      const result = category.updateData({ name: 'AB' })

      expectFailureWithMessage(
        result,
        'The field "name" must be at least 3 characters',
      )
    })

    it('should fail if type is invalid', () => {
      const category = expectSuccess(loadCategory())
      const result = category.updateData({ type: 'invalid-type' })

      expectFailureWithMessage(
        result,
        'The field "type" must be "expense" or "income"',
      )
    })

    it('should fail if parentId is not a valid UUID', () => {
      const category = expectSuccess(loadCategory())
      const result = category.updateData({ parentId: 'not-a-valid-uuid' })

      expectFailureWithMessage(result, 'must be a valid UUID')
    })

    it('should fail if category tries to be its own parent', () => {
      const category = expectSuccess(loadCategory())
      const result = category.updateData({ parentId: category.id.value })

      expectFailureWithMessage(result, 'A category cannot be its own parent')
    })
  })
})
