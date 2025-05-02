import { Card } from '@domain/card'
import {
  RequiredFieldError,
  InvalidUuidError,
  MinLengthError,
  InvalidCurrencyError,
  NumberRangeError,
  ValidationError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

describe('Card Entity', () => {
  const validCreateData = {
    name: 'Meu Cartão',
    limit: 1000,
    closingDay: 10,
    dueDay: 20,
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validLoadData = {
    ...validCreateData,
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const createCard = (overrides = {}) =>
    Card.create({ ...validCreateData, ...overrides })

  const loadCard = (overrides = {}) =>
    Card.load({ ...validLoadData, ...overrides })

  describe('create()', () => {
    it('should create a valid card with all required fields', () => {
      const result = createCard()
      const card = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(card)

      domainAssert.assertEqual(card.name, validCreateData.name)
      domainAssert.assertEqual(card.limit, validCreateData.limit)
      domainAssert.assertEqual(card.closingDay, validCreateData.closingDay)
      domainAssert.assertEqual(card.dueDay, validCreateData.dueDay)
      domainAssert.expectUniqueIdEquals(
        card.accountId,
        validCreateData.accountId,
      )
    })

    it('should fail if name is empty', () => {
      const result = createCard({ name: '' })

      domainAssert.expectResultFailure(result, [new RequiredFieldError('name')])
    })

    it('should fail if name is less than 3 characters', () => {
      const result = createCard({ name: 'AB' })

      domainAssert.expectResultFailure(result, [
        new MinLengthError('name', 3, 2),
      ])
    })

    it('should fail if limit is empty', () => {
      const result = createCard({ limit: undefined })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('limit'),
      ])
    })

    it('should fail if limit is not a valid currency', () => {
      const result = createCard({ limit: -100 })

      domainAssert.expectResultFailure(result, [
        new InvalidCurrencyError('limit', -100),
      ])
    })

    it('should fail if closingDay is empty', () => {
      const result = createCard({ closingDay: undefined })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('closingDay'),
      ])
    })

    it('should fail if closingDay is below valid range', () => {
      const resultLow = createCard({ closingDay: 0 })
      domainAssert.expectResultFailure(resultLow, [
        new NumberRangeError('closingDay', 1, 31, 0),
      ])
    })

    it('should fail if closingDay is above valid range', () => {
      const resultHigh = createCard({ closingDay: 32 })
      domainAssert.expectResultFailure(resultHigh, [
        new NumberRangeError('closingDay', 1, 31, 32),
      ])
    })

    it('should fail if dueDay is empty', () => {
      const result = createCard({ dueDay: undefined })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('dueDay'),
      ])
    })
    it('should fail if dueDay is below valid range', () => {
      const resultLow = createCard({ dueDay: 0 })
      domainAssert.expectResultFailure(resultLow, [
        new NumberRangeError('dueDay', 1, 31, 0),
      ])
    })
    it('should fail if dueDay is above valid range', () => {
      const resultHigh = createCard({ dueDay: 32 })
      domainAssert.expectResultFailure(resultHigh, [
        new NumberRangeError('dueDay', 1, 31, 32),
      ])
    })

    it('should fail if accountId is empty', () => {
      const result = createCard({ accountId: undefined })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('accountId'),
      ])
    })

    it('should fail if accountId is not a valid UUID', () => {
      const result = createCard({ accountId: 'not-a-valid-uuid' })

      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('accountId', 'not-a-valid-uuid'),
      ])
    })
  })

  describe('load()', () => {
    it('should load a valid card with all properties', () => {
      const result = loadCard()
      const card = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(card, validLoadData.id)

      domainAssert.assertEqual(card.name, validLoadData.name)
      domainAssert.assertEqual(card.limit, validLoadData.limit)
      domainAssert.assertEqual(card.closingDay, validLoadData.closingDay)
      domainAssert.assertEqual(card.dueDay, validLoadData.dueDay)
    })
  })

  describe('updateData()', () => {
    it('should update fields when valid', () => {
      const createResult = createCard()
      const card = domainAssert.expectResultSuccess(createResult)

      const updates = {
        name: 'Novo Nome Cartão',
        limit: 3500,
        closingDay: 25,
        dueDay: 15,
        accountId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
      }

      const updateResult = card.updateData(updates)
      domainAssert.expectResultSuccess(updateResult)

      domainAssert.assertEqual(card.name, updates.name)
      domainAssert.assertEqual(card.limit, updates.limit)
      domainAssert.assertEqual(card.closingDay, updates.closingDay)
      domainAssert.assertEqual(card.dueDay, updates.dueDay)
      domainAssert.expectUniqueIdEquals(card.accountId, updates.accountId)
    })

    it('should fail if name is invalid', () => {
      const card = createCard().value
      const originalName = card.name

      const updateResult = card.updateData({ name: 'AB' })

      domainAssert.expectResultFailure(updateResult, [
        new MinLengthError('name', 3, 2),
      ])
      domainAssert.assertEqual(card.name, originalName)
    })

    it('should fail if limit is negative', () => {
      const card = createCard().value
      const originalLimit = card.limit

      const updateResult = card.updateData({ limit: -200 })

      domainAssert.expectResultFailure(updateResult, [
        new InvalidCurrencyError('limit', -200),
      ])
      domainAssert.assertEqual(card.limit, originalLimit)
    })

    it('should fail if closingDay is below range', () => {
      const card = createCard().value
      const originalClosingDay = card.closingDay

      const updateResult = card.updateData({ closingDay: 0 })

      domainAssert.expectResultFailure(updateResult, [
        new NumberRangeError('closingDay', 1, 31, 0),
      ])
      domainAssert.assertEqual(card.closingDay, originalClosingDay)
    })

    it('should fail if closingDay is above range', () => {
      const card = createCard().value
      const originalClosingDay = card.closingDay

      const updateResult = card.updateData({ closingDay: 32 })

      domainAssert.expectResultFailure(updateResult, [
        new NumberRangeError('closingDay', 1, 31, 32),
      ])
      domainAssert.assertEqual(card.closingDay, originalClosingDay)
    })

    it('should fail if dueDay is below range', () => {
      const card = createCard().value
      const originalDueDay = card.dueDay

      const updateResult = card.updateData({ dueDay: 0 })

      domainAssert.expectResultFailure(updateResult, [
        new NumberRangeError('dueDay', 1, 31, 0),
      ])
      domainAssert.assertEqual(card.dueDay, originalDueDay)
    })

    it('should fail if dueDay is above range', () => {
      const card = createCard().value
      const originalDueDay = card.dueDay

      const updateResult = card.updateData({ dueDay: 32 })

      domainAssert.expectResultFailure(updateResult, [
        new NumberRangeError('dueDay', 1, 31, 32),
      ])
      domainAssert.assertEqual(card.dueDay, originalDueDay)
    })

    it('should fail if accountId is not a valid UUID', () => {
      const card = createCard().value
      const originalAccountId = card.accountId.value

      const updateResult = card.updateData({ accountId: 'not-a-valid-uuid' })

      domainAssert.expectResultFailure(updateResult, [
        new InvalidUuidError('accountId', 'not-a-valid-uuid'),
      ])
      domainAssert.assertEqual(card.accountId.value, originalAccountId)
    })
  })

  describe('updateLimit()', () => {
    it('should update limit to valid value', () => {
      const createResult = createCard()
      const card = domainAssert.expectResultSuccess(createResult)
      const initialLimit = card.limit

      const updateResult = card.updateLimit(5000)
      domainAssert.expectResultSuccess(updateResult)

      domainAssert.assertEqual(card.limit, 5000)
      domainAssert.assertNotEqual(card.limit, initialLimit)
    })

    it('should fail if new limit is negative', () => {
      const card = createCard().value
      const originalLimit = card.limit

      const updateResult = card.updateLimit(-500)

      domainAssert.expectResultFailure(updateResult, [
        new InvalidCurrencyError('limit', -500),
      ])
      domainAssert.assertEqual(card.limit, originalLimit)
    })
  })
})
