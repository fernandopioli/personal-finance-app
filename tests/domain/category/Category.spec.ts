import { Category } from '@domain/category'
import { domainAssert } from '@tests/framework'
import {
  MinLengthError,
  RequiredFieldError,
  InvalidUuidError,
} from '@domain/errors'
import { InvalidCategoryTypeError } from '@domain/category/errors'
import { InvalidCategoryParentError } from '@domain/category/errors'

describe('Category Entity', () => {
  const validCreateData = {
    name: 'Alimentação',
    type: 'expense',
  }

  const validLoadData = {
    ...validCreateData,
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
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
      const result = createCategory()
      const category = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(category)
      domainAssert.assertEqual(category.name, validCreateData.name)
      domainAssert.expectValidValueObject(category.type, validCreateData.type)
      domainAssert.assertEqual(category.description, undefined)
      domainAssert.assertEqual(category.parentId, undefined)
      domainAssert.assertTrue(category.isRoot())
    })

    it('should create a valid income category', () => {
      const result = createCategory({ type: 'income' })
      const category = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidValueObject(category.type, 'income')
    })

    it('should create a category with description', () => {
      const description = 'Despesas com alimentação'
      const result = createCategory({ description })
      const category = domainAssert.expectResultSuccess(result)

      domainAssert.assertEqual(category.description, description)
    })

    it('should create a subcategory', () => {
      const parentId = '8f2bd772-6af8-48a2-9326-6ef5049d51fa'
      const result = createCategory({ parentId })
      const category = domainAssert.expectResultSuccess(result)

      domainAssert.expectUniqueIdEquals(category.parentId!, parentId)
      domainAssert.assertFalse(category.isRoot())
    })

    it('should fail if name is empty', () => {
      const result = createCategory({ name: '' })
      domainAssert.expectResultFailure(result, [new RequiredFieldError('name')])
    })

    it('should fail if name is too short', () => {
      const result = createCategory({ name: 'AB' })
      domainAssert.expectResultFailure(result, [
        new MinLengthError('name', 3, 2),
      ])
    })

    it('should fail if type is empty', () => {
      const result = createCategory({ type: '' })
      domainAssert.expectResultFailure(result, [
        new InvalidCategoryTypeError('type', ''),
      ])
    })

    it('should fail if type is invalid', () => {
      const result = createCategory({ type: 'invalid-type' })
      domainAssert.expectResultFailure(result, [
        new InvalidCategoryTypeError('type', 'invalid-type'),
      ])
    })

    it('should fail if parentId is not a valid UUID', () => {
      const result = createCategory({ parentId: 'not-a-valid-uuid' })
      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('parentId', 'not-a-valid-uuid'),
      ])
    })
  })

  describe('load()', () => {
    it('should load a valid category', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(category, validLoadData.id)
      domainAssert.assertEqual(category.name, validLoadData.name)
      domainAssert.expectValidValueObject(category.type, validLoadData.type)
      domainAssert.assertTrue(category.isRoot())
    })

    it('should load a subcategory', () => {
      const parentId = '8f2bd772-6af8-48a2-9326-6ef5049d51fb'
      const result = loadCategory({ parentId })
      const category = domainAssert.expectResultSuccess(result)

      domainAssert.expectUniqueIdEquals(category.parentId!, parentId)
      domainAssert.assertFalse(category.isRoot())
    })
  })

  describe('updateData()', () => {
    it('should update name', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const newName = 'Transporte Público'

      const updateResult = category.updateData({ name: newName })
      domainAssert.expectResultSuccess(updateResult)
      domainAssert.assertEqual(category.name, newName)
    })

    it('should update type', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)

      const updateResult = category.updateData({ type: 'income' })
      domainAssert.expectResultSuccess(updateResult)
      domainAssert.expectValidValueObject(category.type, 'income')
    })

    it('should update description', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const description = 'Transporte público e privado'

      const updateResult = category.updateData({ description })
      domainAssert.expectResultSuccess(updateResult)
      domainAssert.assertEqual(category.description, description)
    })

    it('should update parentId', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const parentId = '8f2bd772-6af8-48a2-9326-6ef5049d51fb'

      const updateResult = category.updateData({ parentId })
      domainAssert.expectResultSuccess(updateResult)

      domainAssert.expectUniqueIdEquals(category.parentId!, parentId)
      domainAssert.assertFalse(category.isRoot())
    })

    it('should fail if name is too short', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const updateResult = category.updateData({ name: 'AB' })

      domainAssert.expectResultFailure(updateResult, [
        new MinLengthError('name', 3, 2),
      ])
    })

    it('should fail if type is invalid', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const updateResult = category.updateData({ type: 'invalid-type' })

      domainAssert.expectResultFailure(updateResult, [
        new InvalidCategoryTypeError('type', 'invalid-type'),
      ])
    })

    it('should fail if parentId is not a valid UUID', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const updateResult = category.updateData({ parentId: 'not-a-valid-uuid' })

      domainAssert.expectResultFailure(updateResult, [
        new InvalidUuidError('parentId', 'not-a-valid-uuid'),
      ])
    })

    it('should fail if category tries to be its own parent', () => {
      const result = loadCategory()
      const category = domainAssert.expectResultSuccess(result)
      const updateResult = category.updateData({ parentId: category.id.value })

      domainAssert.expectResultFailure(updateResult, [
        new InvalidCategoryParentError('parentId', category.id.value),
      ])
    })
  })
})
