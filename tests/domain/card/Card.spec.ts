import { Card } from '@domain/card'
import { Result } from '@domain/core'
import { expectFailureWithMessage } from '@tests/utils'
describe('Card Entity', () => {
  const validCreateData = {
    name: 'Meu Cartão',
    limit: 1000,
    closingDay: 10,
    dueDay: 20,
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validLoadData = {
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    name: 'Cartão Existente',
    limit: 2000,
    closingDay: 15,
    dueDay: 27,
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const createCard = (overrides = {}) =>
    Card.create({ ...validCreateData, ...overrides })

  const loadCard = (overrides = {}) =>
    Card.load({ ...validLoadData, ...overrides })

  const expectSuccess = <T>(result: Result<T>) => {
    expect(result.isSuccess).toBe(true)
    return result.value
  }

  describe('create()', () => {
    it('should create a valid card with all required fields', () => {
      const card = expectSuccess(createCard())

      expect(card.id).toBeDefined()
      expect(card.name).toBe(validCreateData.name)
      expect(card.limit).toBe(validCreateData.limit)
      expect(card.closingDay).toBe(validCreateData.closingDay)
      expect(card.dueDay).toBe(validCreateData.dueDay)
      expect(card.accountId).toBeDefined()
      expect(card.accountId.value).toBe(validCreateData.accountId)
    })

    it('should fail if accountId is not provided', () => {
      const result = createCard({ accountId: undefined })
      expectFailureWithMessage(result, '"accountId" is required')
    })

    it('should fail if accountId is not a valid UUID', () => {
      const result = createCard({ accountId: 'not-a-valid-uuid' })
      expectFailureWithMessage(result, 'must be a valid UUID')
    })

    it('should fail if name is empty', () => {
      const result = createCard({ name: '' })
      expectFailureWithMessage(result, '"name" is required')
    })

    it('should fail if name is less than 3 characters', () => {
      const result = createCard({ name: 'AB' })
      expectFailureWithMessage(result, 'name" must be at least 3 characters')
    })

    it('should fail if limit is empty', () => {
      const result = createCard({ limit: undefined })
      expectFailureWithMessage(result, 'limit" is required')
    })

    it('should fail if limit is negative', () => {
      const result = createCard({ limit: -100 })
      expectFailureWithMessage(result, 'limit" must be >= 0')
    })

    it('should fail if closingDay is outside valid range', () => {
      const resultLow = createCard({ closingDay: 0 })
      expectFailureWithMessage(
        resultLow,
        'The field "closingDay" must be between 1 and 31',
      )

      const resultHigh = createCard({ closingDay: 32 })
      expectFailureWithMessage(
        resultHigh,
        'The field "closingDay" must be between 1 and 31',
      )
    })

    it('should fail if dueDay is outside valid range', () => {
      const resultLow = createCard({ dueDay: 0 })
      expectFailureWithMessage(
        resultLow,
        'The field "dueDay" must be between 1 and 31',
      )

      const resultHigh = createCard({ dueDay: 32 })
      expectFailureWithMessage(
        resultHigh,
        'The field "dueDay" must be between 1 and 31',
      )
    })

    it('should fail if accountId is not a valid UUID', () => {
      const result = createCard({ accountId: 'not-a-valid-uuid' })
      expectFailureWithMessage(result, 'must be a valid UUID')
    })
  })

  describe('load()', () => {
    it('should load a valid card with all properties', () => {
      const card = expectSuccess(loadCard())

      expect(card.id.value).toBe(validLoadData.id)
      expect(card.name).toBe(validLoadData.name)
      expect(card.limit).toBe(validLoadData.limit)
      expect(card.closingDay).toBe(validLoadData.closingDay)
      expect(card.dueDay).toBe(validLoadData.dueDay)
      expect(card.accountId).toBeDefined()
      expect(card.accountId.value).toBe(validLoadData.accountId)
    })
  })

  describe('updateData()', () => {
    it('should update fields when valid', () => {
      const card = expectSuccess(createCard())
      const updates = {
        name: 'Novo Nome Cartão',
        limit: 3500,
        closingDay: 25,
        dueDay: 15,
        accountId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
      }

      const resultUpdate = card.updateData(updates)

      expect(resultUpdate.isSuccess).toBe(true)
      expect(card.name).toBe(updates.name)
      expect(card.limit).toBe(updates.limit)
      expect(card.closingDay).toBe(updates.closingDay)
      expect(card.dueDay).toBe(updates.dueDay)
      expect(card.accountId).toBeDefined()
      expect(card.accountId.value).toBe(updates.accountId)
    })

    it('should fail if accountId is not a valid UUID', () => {
      const card = expectSuccess(createCard())
      const resultUpdate = card.updateData({ accountId: 'not-a-valid-uuid' })

      expectFailureWithMessage(resultUpdate, 'must be a valid UUID')
      expect(card.accountId.value).toBe(validCreateData.accountId)
    })

    it('should fail if name is invalid', () => {
      const card = expectSuccess(createCard())
      const resultUpdate = card.updateData({ name: 'AB' })

      expectFailureWithMessage(
        resultUpdate,
        'name" must be at least 3 characters',
      )
      expect(card.name).toBe(validCreateData.name)
    })

    it('should fail if limit is negative', () => {
      const card = expectSuccess(createCard())
      const resultUpdate = card.updateData({ limit: -200 })

      expectFailureWithMessage(resultUpdate, 'limit" must be >= 0')
      expect(card.limit).toBe(validCreateData.limit)
    })

    it('should fail if closingDay is outside range', () => {
      const card = expectSuccess(createCard())
      const resultUpdate = card.updateData({ closingDay: 32 })

      expectFailureWithMessage(
        resultUpdate,
        'The field "closingDay" must be between 1 and 31',
      )
      expect(card.closingDay).toBe(validCreateData.closingDay)
    })

    it('should fail if dueDay is outside range', () => {
      const card = expectSuccess(createCard())
      const resultUpdate = card.updateData({ dueDay: 0 })

      expectFailureWithMessage(
        resultUpdate,
        'The field "dueDay" must be between 1 and 31',
      )
      expect(card.dueDay).toBe(validCreateData.dueDay)
    })

    it('should fail if accountId is not a valid UUID', () => {
      const card = expectSuccess(createCard())
      const resultUpdate = card.updateData({ accountId: 'not-a-valid-uuid' })

      expectFailureWithMessage(resultUpdate, 'must be a valid UUID')
      expect(card.accountId.value).toBe(validCreateData.accountId)
    })
  })

  describe('updateLimit()', () => {
    it('should update limit to valid value', () => {
      const card = expectSuccess(createCard())
      const initialLimit = card.limit

      const resultLimit = card.updateLimit(5000)

      expect(resultLimit.isSuccess).toBe(true)
      expect(card.limit).toBe(5000)
      expect(card.limit).not.toBe(initialLimit)
    })

    it('should fail if new limit is negative', () => {
      const card = expectSuccess(createCard())
      const resultLimit = card.updateLimit(-500)

      expectFailureWithMessage(resultLimit, 'limit" must be >= 0')
      expect(card.limit).toBe(validCreateData.limit)
    })
  })
})
